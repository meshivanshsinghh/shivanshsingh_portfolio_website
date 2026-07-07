#!/usr/bin/env python3
"""
models.py — Convert Antigravity step payloads into typed Turn objects.

Schema was labeled from real payloads in the FIA conversation DB:

    STEP ENVELOPE (.5.*)                    every step
        .5.1   created_at                   Timestamp {seconds, nanos}
        .5.8   updated_at                   Timestamp
        .5.4   tool_use metadata            when a tool was invoked
            .4.1 tool_use_id                Anthropic 'toolu_vrtx_...' style
            .4.2 tool_name
            .4.3 tool_input                 JSON string
        .5.9   llm_call metadata            when an LLM call happened
            .9.1 model_id                   1026 = Claude Opus via Vertex
            .9.2 input_tokens
            .9.3 / .9.10 output_tokens
            .9.11 request_id                'req_vrtx_...'
        .5.20  identifiers
            .20.1 task_id
            .20.2 step_idx                  matches DB row idx
            .20.3 turn_num
            .20.4 conversation_uuid         matches DB filename

    STEP TYPE (.1)  →  PAYLOAD FIELD
        14  user turn        → .19
              .19.2  text (flat)
              .19.3  repeated Part
              .19.4  attached FileRefs
        15  model turn       → .20
              .20.1 / .20.8  visible reply text
              .20.3  thought/thinking block
              .20.7  tool_call (repeated)
                    .7.1 id, .7.2 name, .7.3 args (JSON string)
              .20.14 raw Vertex response blob (skipped)
        21  shell result     → .28   (with .56, .133, .147 redundant views)
              .28.2  cwd
              .28.6  exit_code
              .28.21.1 stdout
              .28.23 command
        8   file read        → .14
              .14.1  file URI
              .14.4/.14.9  content
        90  ephemeral system → .103
              .103.1 text
              .103.3 tags
        98/99  lifecycle checkpoints → skip

Usage:
    python3 models.py <db-path>                      # summary
    python3 models.py <db-path> --role assistant     # filter by role
    python3 models.py <db-path> --limit 50
    python3 models.py <db-path> --include-ephemeral
    python3 models.py <db-path> --verify             # sanity checks
"""

import sys
import json
import sqlite3
import argparse
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional

from protobuf import decode, WIRE_VARINT


# ---------------- constants ----------------

STEP_USER = 14
STEP_MODEL = 15
STEP_SHELL = 21
STEP_FILE_READ = 8
STEP_EPHEMERAL = 90
STEP_CHECKPOINT_98 = 98
STEP_CHECKPOINT_99 = 99

MODEL_ID_NAMES = {
    1026: "claude-opus (via vertex)",
    1016: "claude-opus (via vertex, older?)",
}


# ---------------- decoding helpers ----------------

def _string(fields, num):
    for f in fields:
        if f.number == num and f.interpretation == "string":
            return f.string_value
    return None


def _varint(fields, num):
    for f in fields:
        if f.number == num and f.wire_type == WIRE_VARINT:
            return f.varint_value
    return None


def _nested(fields, num):
    for f in fields:
        if f.number == num and f.interpretation == "message":
            return f.nested
    return None


def _each(fields, num):
    for f in fields:
        if f.number == num:
            yield f


def _timestamp(fields, num):
    """Read a Timestamp {seconds, nanos} submessage as datetime (UTC)."""
    sub = _nested(fields, num)
    if sub is None:
        return None
    seconds = _varint(sub, 1)
    nanos = _varint(sub, 2) or 0
    if seconds is None:
        return None
    try:
        return datetime.fromtimestamp(seconds + nanos / 1e9, tz=timezone.utc)
    except (OverflowError, OSError, ValueError):
        return None


# ---------------- types ----------------

@dataclass
class ToolCall:
    id: str
    name: str
    args: dict          # parsed from .7.3 JSON string
    raw_args: str = ""  # kept in case JSON parse fails


@dataclass
class ToolResult:
    tool_use_id: str = ""
    command: str = ""
    cwd: str = ""
    stdout: str = ""
    exit_code: Optional[int] = None


@dataclass
class Turn:
    idx: int
    turn_num: int
    step_type: int
    role: str  # user | assistant | tool_result | ephemeral | file_read | checkpoint | parse_error | unknown
    created_at: Optional[datetime] = None
    text: str = ""
    thought: str = ""
    tool_calls: list = field(default_factory=list)
    tool_result: Optional[ToolResult] = None
    attached_files: list = field(default_factory=list)
    model_id: Optional[int] = None
    input_tokens: Optional[int] = None
    output_tokens: Optional[int] = None
    request_id: str = ""
    top_field_shape: tuple = ()


@dataclass
class Conversation:
    uuid: str
    task_id: str
    db_path: str
    turns: list = field(default_factory=list)


# ---------------- per-type parsers ----------------

def _parse_user(turn: Turn, fields):
    turn.role = "user"
    payload = _nested(fields, 19) or []
    turn.text = (_string(payload, 2) or "").strip()
    # .19.4 = attachment wrapper (message with sub-file-refs)
    for outer in _each(payload, 4):
        if outer.interpretation != "message":
            continue
        for sub in outer.nested:
            if sub.interpretation != "message":
                continue
            # File URI lives at .12; the containing directory at .13
            uri = _string(sub.nested, 12)
            if uri and uri not in turn.attached_files:
                turn.attached_files.append(uri)


def _parse_model(turn: Turn, fields):
    turn.role = "assistant"
    payload = _nested(fields, 20) or []
    turn.text = (_string(payload, 1) or _string(payload, 8) or "").strip()
    turn.thought = (_string(payload, 3) or "").strip()
    # .20.7 = ToolCall, repeated
    for f in _each(payload, 7):
        if f.interpretation != "message":
            continue
        tid = _string(f.nested, 1) or ""
        tname = _string(f.nested, 2) or ""
        raw_args = _string(f.nested, 3) or ""
        try:
            parsed_args = json.loads(raw_args) if raw_args else {}
        except json.JSONDecodeError:
            parsed_args = {}
        turn.tool_calls.append(ToolCall(id=tid, name=tname, args=parsed_args, raw_args=raw_args))


def _parse_shell(turn: Turn, fields, envelope):
    turn.role = "tool_result"
    payload = _nested(fields, 28) or []
    # tool_use_id from envelope tool metadata
    tool_meta = _nested(envelope, 4) or []
    tool_use_id = _string(tool_meta, 1) or ""
    # stdout at .28.21.1
    stdout_msg = _nested(payload, 21) or []
    stdout = _string(stdout_msg, 1) or ""
    turn.tool_result = ToolResult(
        tool_use_id=tool_use_id,
        command=_string(payload, 23) or "",
        cwd=_string(payload, 2) or "",
        stdout=stdout,
        exit_code=_varint(payload, 6),
    )


def _parse_file_read(turn: Turn, fields):
    turn.role = "file_read"
    payload = _nested(fields, 14) or []
    uri = _string(payload, 1) or ""
    # Content may live at .14.9 (large CSV) or .14.4 (smaller). Take whichever exists.
    content = _string(payload, 9) or _string(payload, 4) or ""
    turn.text = content
    if uri:
        turn.attached_files.append(uri)


def _parse_ephemeral(turn: Turn, fields):
    turn.role = "ephemeral"
    payload = _nested(fields, 103) or []
    turn.text = _string(payload, 1) or ""


# ---------------- top-level dispatch ----------------

def parse_step(idx: int, payload: bytes) -> Optional[Turn]:
    """Return a Turn, or None for checkpoint steps we skip entirely."""
    try:
        fields = decode(payload)
    except Exception as e:
        return Turn(idx=idx, turn_num=-1, step_type=-1, role="parse_error", text=str(e))

    step_type = _varint(fields, 1) or -1

    if step_type in (STEP_CHECKPOINT_98, STEP_CHECKPOINT_99):
        return None

    envelope = _nested(fields, 5) or []
    ids = _nested(envelope, 20) or []

    turn = Turn(
        idx=idx,
        turn_num=_varint(ids, 3) or -1,
        step_type=step_type,
        role="unknown",
        created_at=_timestamp(envelope, 1),
        top_field_shape=tuple(sorted({f.number for f in fields})),
    )

    # LLM-call telemetry (whenever present)
    llm_meta = _nested(envelope, 9)
    if llm_meta:
        turn.model_id = _varint(llm_meta, 1)
        turn.input_tokens = _varint(llm_meta, 2)
        turn.output_tokens = _varint(llm_meta, 3) or _varint(llm_meta, 10)
        turn.request_id = _string(llm_meta, 11) or ""

    if step_type == STEP_USER:
        _parse_user(turn, fields)
    elif step_type == STEP_MODEL:
        _parse_model(turn, fields)
    elif step_type == STEP_SHELL:
        _parse_shell(turn, fields, envelope)
    elif step_type == STEP_FILE_READ:
        _parse_file_read(turn, fields)
    elif step_type == STEP_EPHEMERAL:
        _parse_ephemeral(turn, fields)
    # else: role stays "unknown" — we'll see it in --verify

    return turn


# ---------------- loading a full DB ----------------

def load_conversation(db_path: str) -> Conversation:
    con = sqlite3.connect(db_path)
    rows = con.execute("SELECT idx, step_payload FROM steps ORDER BY idx").fetchall()

    conv = Conversation(uuid="", task_id="", db_path=db_path)
    for idx, payload in rows:
        t = parse_step(idx, payload)
        if t is None:
            continue
        # Pull UUID + task_id from the first step that has an envelope
        if not conv.uuid:
            try:
                fields = decode(payload)
                env = _nested(fields, 5) or []
                ids = _nested(env, 20) or []
                conv.uuid = _string(ids, 4) or ""
                conv.task_id = _string(ids, 1) or ""
            except Exception:
                pass
        conv.turns.append(t)
    return conv


# ---------------- verification ----------------

def verify(conv: Conversation):
    print(f"# verify: {conv.db_path}")
    print(f"# conversation uuid: {conv.uuid}")
    print(f"# task uuid:        {conv.task_id}")
    print(f"# {len(conv.turns)} parsed turns\n")

    roles = {}
    step_types = {}
    unknown_types = set()
    parse_errors = []
    tool_ids_emitted = set()
    tool_ids_consumed = set()
    turn_nums = []

    for t in conv.turns:
        roles[t.role] = roles.get(t.role, 0) + 1
        step_types[t.step_type] = step_types.get(t.step_type, 0) + 1
        if t.role == "unknown":
            unknown_types.add(t.step_type)
        if t.role == "parse_error":
            parse_errors.append(t.idx)
        for tc in t.tool_calls:
            if tc.id:
                tool_ids_emitted.add(tc.id)
        if t.tool_result and t.tool_result.tool_use_id:
            tool_ids_consumed.add(t.tool_result.tool_use_id)
        if t.turn_num >= 0:
            turn_nums.append(t.turn_num)

    print("role distribution:")
    for r, n in sorted(roles.items(), key=lambda x: -x[1]):
        print(f"  {r:<14} {n:>4}")
    print()

    print("step_type distribution:")
    for st, n in sorted(step_types.items(), key=lambda x: -x[1]):
        print(f"  {st!s:>4}  {n:>4}")
    print()

    print(f"unknown step types (not yet mapped): {sorted(unknown_types) or 'none'}")
    print(f"parse errors: {len(parse_errors)} {parse_errors[:5]}")
    print()

    orphan_calls = tool_ids_emitted - tool_ids_consumed
    orphan_results = tool_ids_consumed - tool_ids_emitted
    print(f"tool calls emitted: {len(tool_ids_emitted)}")
    print(f"tool calls consumed by results: {len(tool_ids_consumed)}")
    print(f"orphan calls (emitted, no result):  {len(orphan_calls)}")
    print(f"orphan results (result, no call):   {len(orphan_results)}")

    print()
    print(f"turn_num range: {min(turn_nums) if turn_nums else '-'}..{max(turn_nums) if turn_nums else '-'}")


# ---------------- CLI ----------------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("db")
    ap.add_argument("--include-ephemeral", action="store_true")
    ap.add_argument("--role", help="filter by role")
    ap.add_argument("--limit", type=int, default=20)
    ap.add_argument("--verify", action="store_true", help="print schema-coverage report and exit")
    args = ap.parse_args()

    conv = load_conversation(args.db)

    if args.verify:
        verify(conv)
        return

    print(f"# conversation {conv.uuid}")
    print(f"# task {conv.task_id}")
    print(f"# {len(conv.turns)} turns total\n")

    shown = 0
    for t in conv.turns:
        if not args.include_ephemeral and t.role == "ephemeral":
            continue
        if args.role and t.role != args.role:
            continue
        if shown >= args.limit:
            print(f"... ({len(conv.turns) - shown} more turns not shown)")
            break

        header = f"[idx {t.idx:>4}] turn={t.turn_num:<4} type={t.step_type:<3} role={t.role}"
        if t.created_at:
            header += f"  {t.created_at.isoformat()}"
        print(header)

        if t.text:
            display = t.text if len(t.text) <= 220 else t.text[:220] + f"... (+{len(t.text)-220} chars)"
            print(f"     text:    {display!r}")
        if t.thought:
            display = t.thought[:180] + (f"... (+{len(t.thought)-180} chars)" if len(t.thought) > 180 else "")
            print(f"     thought: {display!r}")
        for tc in t.tool_calls:
            args_short = json.dumps(tc.args)
            args_short = args_short if len(args_short) <= 150 else args_short[:150] + f"... (+{len(args_short)-150})"
            print(f"     tool:    {tc.name}  id={tc.id[:24]}...")
            print(f"              args={args_short}")
        if t.tool_result:
            tr = t.tool_result
            stdout_short = tr.stdout[:150].replace('\n', '\\n')
            print(f"     result:  cmd={tr.command!r} exit={tr.exit_code}")
            print(f"              stdout={stdout_short!r}")
        if t.attached_files:
            for a in t.attached_files[:3]:
                print(f"     file:    {a}")
        if t.output_tokens:
            model_name = MODEL_ID_NAMES.get(t.model_id, f"model_id={t.model_id}")
            print(f"     model:   {model_name}  tokens in={t.input_tokens} out={t.output_tokens}")
        print()
        shown += 1


if __name__ == "__main__":
    main()
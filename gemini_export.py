#!/usr/bin/env python3
"""
gemini_export.py (v2) — Export Antigravity conversation as Gemini CLI JSONL
that passes Paxel's GeminiNormalizer.

Validated against the paxel-client container (ghcr.io/yc-software/paxel-client).
Format requirements (from /rails/app/services/gemini_normalizer.rb):

  * Header line: NO "type" field, MUST carry "sessionId" AND "projectHash".
    A "directories" array is used for cwd metadata.

  * User/gemini events: MUST have "id" — records without one are dropped
    silently by the normalizer's replay function. Every event we emit gets
    a unique id.

  * Tool results are NOT separate events. They live inline inside each
    toolCall as .result (String, Array, or Hash with {output, error}).
    We pair Antigravity's shell tool_result steps back to their originating
    tool_use_id and inline the stdout on the assistant turn.

  * Thoughts must be an array of {subject, description, timestamp} hashes,
    not raw strings. The normalizer reads thought["subject"] and
    thought["description"] and concatenates them.

  * Tool names should be remapped to Gemini CLI canonical (run_shell_command,
    read_file, list_directory, replace, ...) so the normalizer's TOOL_NAME_MAP
    triggers Claude-canonical Bash / Read / LS / Edit and the analyzer's
    file_edit / read / subagent signal extractors fire.

  * JSON must use compact separators — upload.sh's line-1 sed is
    space-sensitive when it pulls sessionId out of the header.

Usage:
    python3 gemini_export.py export <db>
    python3 gemini_export.py preview <db> [--limit N]
"""

import json
import uuid
import hashlib
import argparse
from pathlib import Path
from typing import Optional, Dict
from os.path import commonpath

from models import load_conversation, Conversation, Turn, MODEL_ID_NAMES


MAX_STDOUT_INLINE = 16000
MAX_THOUGHT_INLINE = 20000


# Antigravity tool name -> Gemini CLI canonical (matches keys in the
# normalizer's TOOL_NAME_MAP so it can convert to Claude's Bash/Read/LS/Edit).
TOOL_NAME_REMAP = {
    "run_command":                "run_shell_command",   # -> Bash
    "view_file":                  "read_file",           # -> Read
    "list_dir":                   "list_directory",      # -> LS
    "list_directory":             "list_directory",
    "write_file":                 "write_file",          # -> Write
    "create_file":                "write_file",
    "edit_file":                  "replace",             # -> Edit
    "replace_file_content":       "replace",
    "multi_replace_file_content": "replace",
    "search":                     "grep_search",         # -> Grep
    "grep":                       "grep_search",
    "grep_search":                "grep_search",
    "glob":                       "glob",                # -> Glob
    "web_search":                 "google_web_search",   # -> WebSearch
    "google_web_search":          "google_web_search",
    "web_fetch":                  "web_fetch",           # -> WebFetch
    "read_url":                   "web_fetch",
    "todo":                       "write_todos",         # -> TodoWrite
    "write_todo":                 "write_todos",
    "write_todos":                "write_todos",
}


def _iso(dt):
    return dt.isoformat() if dt else ""


def _truncate(s, limit):
    if s is None:
        return ""
    if len(s) <= limit:
        return s
    return s[:limit] + f"\n... [truncated {len(s) - limit:,} more chars]"


def _dumps(obj):
    """Compact JSON — required by upload.sh's line-1 sessionId regex."""
    return json.dumps(obj, separators=(",", ":"), ensure_ascii=False)


def remap_tool_name(name: str) -> str:
    return TOOL_NAME_REMAP.get(name, name)


def build_tool_result_lookup(conv: Conversation) -> Dict[str, str]:
    """Map tool_use_id -> stdout string, from paired shell tool_result turns."""
    lookup: Dict[str, str] = {}
    for t in conv.turns:
        if t.role != "tool_result" or t.tool_result is None:
            continue
        tr = t.tool_result
        if not tr.tool_use_id:
            continue
        text = tr.stdout or ""
        text = _truncate(text, MAX_STDOUT_INLINE)
        if tr.exit_code is not None and tr.exit_code != 0:
            text = f"[exit {tr.exit_code}]\n{text}"
        lookup[tr.tool_use_id] = text
    return lookup


def infer_project_root(conv: Conversation) -> str:
    cwds = [
        t.tool_result.cwd for t in conv.turns
        if t.tool_result and t.tool_result.cwd
    ]
    if cwds:
        try:
            return commonpath(cwds)
        except ValueError:
            return cwds[0]
    paths = []
    for t in conv.turns:
        for f in t.attached_files:
            if f.startswith("file://"):
                paths.append(f[len("file://"):])
    if paths:
        try:
            return commonpath(paths)
        except ValueError:
            return paths[0]
    return ""


def turn_to_event(turn: Turn, tool_lookup: Dict[str, str]) -> Optional[dict]:
    """Convert an Antigravity turn to a Gemini CLI JSONL event, or None."""
    event_id = f"evt-{turn.idx:06d}"

    if turn.role == "user":
        if not turn.text:
            return None
        return {
            "id": event_id,
            "type": "user",
            "timestamp": _iso(turn.created_at),
            "content": turn.text,
        }

    if turn.role == "assistant":
        evt = {
            "id": event_id,
            "type": "gemini",
            "timestamp": _iso(turn.created_at),
            "content": turn.text or "",
        }

        if turn.thought:
            evt["thoughts"] = [{
                "subject": "",
                "description": _truncate(turn.thought, MAX_THOUGHT_INLINE),
                "timestamp": _iso(turn.created_at),
            }]

        if turn.tool_calls:
            tool_calls = []
            for tc in turn.tool_calls:
                call = {
                    "id": tc.id or "",
                    "name": remap_tool_name(tc.name),
                    "args": tc.args if isinstance(tc.args, dict) else {},
                }
                # Inline the paired shell result if we have it
                if tc.id and tc.id in tool_lookup:
                    call["result"] = tool_lookup[tc.id]
                tool_calls.append(call)
            evt["toolCalls"] = tool_calls

        if turn.model_id is not None:
            evt["model"] = MODEL_ID_NAMES.get(turn.model_id, f"model_id={turn.model_id}")

        return evt

    # Skip: tool_result (already merged), file_read (no reliable pairing),
    # ephemeral, unknown, checkpoint, parse_error
    return None


def build_events(conv: Conversation):
    tool_lookup = build_tool_result_lookup(conv)
    events = []
    for turn in conv.turns:
        evt = turn_to_event(turn, tool_lookup)
        if evt is not None:
            events.append(evt)
    return events, tool_lookup


def export_conversation(conv: Conversation, out_dir: Path,
                        project_root: str = "", slug: str = ""):
    session_id = str(uuid.uuid4())
    if not project_root:
        project_root = infer_project_root(conv)
    if not slug:
        seed = project_root or conv.uuid
        slug = "antigravity-" + hashlib.sha256(seed.encode()).hexdigest()[:12]

    project_hash = (
        hashlib.sha256(project_root.encode()).hexdigest()[:16]
        if project_root else ""
    )

    base = out_dir / slug
    (base / "chats").mkdir(parents=True, exist_ok=True)
    (base / ".project_root").write_text(project_root + "\n" if project_root else "")

    start_time = ""
    for t in conv.turns:
        if t.created_at:
            start_time = _iso(t.created_at)
            break

    events, tool_lookup = build_events(conv)

    jsonl_path = base / "chats" / f"session-{session_id}.jsonl"
    with jsonl_path.open("w") as fp:
        # Header — NO "type" field, must have sessionId AND projectHash
        header = {
            "sessionId": session_id,
            "projectHash": project_hash,
            "startTime": start_time,
        }
        if project_root:
            header["directories"] = [project_root]
        header["source"] = "antigravity"
        header["conversationUuid"] = conv.uuid
        fp.write(_dumps(header) + "\n")

        for evt in events:
            fp.write(_dumps(evt) + "\n")

    return {
        "path": jsonl_path,
        "slug": slug,
        "project_root": project_root,
        "events_written": len(events),
        "tool_results_paired": len(tool_lookup),
    }


def cmd_export(args):
    conv = load_conversation(args.db)
    out_dir = Path(args.out).expanduser()
    r = export_conversation(conv, out_dir, args.project_root, args.slug)

    role_counts = {}
    for t in conv.turns:
        role_counts[t.role] = role_counts.get(t.role, 0) + 1

    print(f"# conversation:      {conv.uuid}")
    print(f"# project_root:      {r['project_root'] or '(none)'}")
    print(f"# slug:              {r['slug']}")
    print(f"# transcript:        {r['path']}")
    print(f"# events written:    {r['events_written']}")
    print(f"# tool results paired: {r['tool_results_paired']}")
    print(f"# turns by role:")
    for role, n in sorted(role_counts.items(), key=lambda x: -x[1]):
        print(f"    {role:<14} {n:>4}")


def cmd_preview(args):
    conv = load_conversation(args.db)
    project_root = args.project_root or infer_project_root(conv)
    events, tool_lookup = build_events(conv)

    header = {
        "sessionId": "PREVIEW-" + conv.uuid[:8],
        "projectHash": (
            hashlib.sha256(project_root.encode()).hexdigest()[:16]
            if project_root else ""
        ),
    }
    if project_root:
        header["directories"] = [project_root]
    print(_dumps(header))

    for i, evt in enumerate(events):
        if i >= args.limit:
            print(f"... ({len(events) - i} more events not shown)")
            break
        print(_dumps(evt))


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd")

    e = sub.add_parser("export")
    e.add_argument("db")
    e.add_argument("--out", default="~/.gemini/tmp")
    e.add_argument("--project-root", default="")
    e.add_argument("--slug", default="")
    e.set_defaults(func=cmd_export)

    p = sub.add_parser("preview")
    p.add_argument("db")
    p.add_argument("--project-root", default="")
    p.add_argument("--limit", type=int, default=15)
    p.set_defaults(func=cmd_preview)

    args, _ = ap.parse_known_args()
    if args.cmd is None:
        ap2 = argparse.ArgumentParser()
        ap2.add_argument("db")
        ap2.add_argument("--out", default="~/.gemini/tmp")
        ap2.add_argument("--project-root", default="")
        ap2.add_argument("--slug", default="")
        args = ap2.parse_args()
        args.func = cmd_export

    args.func(args)


if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""
protobuf.py — Generic protobuf wire-format decoder.

Decodes protobuf-encoded bytes without needing .proto files. Walks the wire
format, recursively identifies nested messages, distinguishes strings vs
opaque bytes, and flags plausible unix timestamps.

Usage:
    python3 protobuf.py <file>                 # print full tree
    python3 protobuf.py <file> --path .1.5.2   # focus on a subtree
    python3 protobuf.py <file> --strings       # dump every string field with its path
    python3 protobuf.py <file> --raw           # show full hex for opaque bytes fields
    python3 protobuf.py <file> --max-string N  # truncate string display at N chars (default 200)

Or import:
    from protobuf import decode, walk, find_path
    fields = decode(open('payload163.bin', 'rb').read())

Wire type reference (protobuf spec):
    0 = VARINT       (int32/int64/uint/bool/enum)
    1 = I64          (fixed64/sfixed64/double)
    2 = LEN          (string/bytes/embedded message/packed repeated)
    5 = I32          (fixed32/sfixed32/float)
"""

import sys
import struct
import argparse
import datetime
from dataclasses import dataclass
from typing import Optional

WIRE_VARINT = 0
WIRE_I64 = 1
WIRE_LEN = 2
WIRE_SGROUP = 3
WIRE_EGROUP = 4
WIRE_I32 = 5

WIRE_NAMES = {0: "varint", 1: "i64", 2: "len", 5: "i32"}


@dataclass
class Field:
    number: int
    wire_type: int
    raw: bytes
    varint_value: Optional[int] = None
    fixed_value: Optional[int] = None
    interpretation: Optional[str] = None  # "message" | "string" | "bytes"
    nested: Optional[list] = None
    string_value: Optional[str] = None
    timestamp_hint: Optional[str] = None


# ---------- varint ----------

def read_varint(buf: bytes, pos: int):
    result = 0
    shift = 0
    start = pos
    while True:
        if pos >= len(buf):
            raise ValueError(f"varint truncated at pos {start}")
        b = buf[pos]
        pos += 1
        result |= (b & 0x7F) << shift
        if not (b & 0x80):
            return result, pos
        shift += 7
        if shift > 70:
            raise ValueError(f"varint too long at pos {start}")


# ---------- heuristics ----------

TS_MIN_S  = 946_684_800          # 2000-01-01
TS_MAX_S  = 4_102_444_800        # 2100-01-01
TS_MIN_MS = TS_MIN_S * 1_000
TS_MAX_MS = TS_MAX_S * 1_000
TS_MIN_US = TS_MIN_S * 1_000_000
TS_MAX_US = TS_MAX_S * 1_000_000


def timestamp_hint(value: int) -> Optional[str]:
    if value <= 0:
        return None
    try:
        if TS_MIN_S <= value <= TS_MAX_S:
            return f"~{datetime.datetime.utcfromtimestamp(value).isoformat()}Z (s)"
        if TS_MIN_MS <= value <= TS_MAX_MS:
            return f"~{datetime.datetime.utcfromtimestamp(value/1_000).isoformat()}Z (ms)"
        if TS_MIN_US <= value <= TS_MAX_US:
            return f"~{datetime.datetime.utcfromtimestamp(value/1_000_000).isoformat()}Z (us)"
    except (OverflowError, OSError, ValueError):
        return None
    return None


def looks_like_utf8(data: bytes) -> Optional[str]:
    """Return decoded string if data looks like human-readable UTF-8, else None."""
    if not data:
        return ""
    try:
        s = data.decode("utf-8")
    except UnicodeDecodeError:
        return None
    if not s:
        return ""
    printable = sum(1 for c in s if c.isprintable() or c in "\r\n\t")
    if printable / len(s) < 0.9:
        return None
    return s


def try_parse_message(data: bytes):
    """Try to parse `data` as a nested protobuf message. Return list[Field] or None."""
    if not data:
        return None
    try:
        fields = list(_parse_fields(data))
    except Exception:
        return None
    if not fields:
        return None
    for f in fields:
        if f.number == 0 or f.number > (1 << 29):
            return None
        if f.wire_type not in (WIRE_VARINT, WIRE_I64, WIRE_LEN, WIRE_I32):
            return None
    return fields


# ---------- core parser ----------

def _parse_fields(buf: bytes):
    pos = 0
    while pos < len(buf):
        tag, pos = read_varint(buf, pos)
        field_num = tag >> 3
        wire_type = tag & 0x7

        if wire_type == WIRE_VARINT:
            value, pos = read_varint(buf, pos)
            f = Field(number=field_num, wire_type=wire_type, raw=b"", varint_value=value)
            hint = timestamp_hint(value)
            if hint:
                f.timestamp_hint = hint
            yield f

        elif wire_type == WIRE_I64:
            if pos + 8 > len(buf):
                raise ValueError("i64 truncated")
            raw = buf[pos:pos + 8]
            f = Field(number=field_num, wire_type=wire_type, raw=raw,
                      fixed_value=struct.unpack("<q", raw)[0])
            pos += 8
            yield f

        elif wire_type == WIRE_LEN:
            length, pos = read_varint(buf, pos)
            if pos + length > len(buf):
                raise ValueError("len truncated")
            data = buf[pos:pos + length]
            pos += length
            f = Field(number=field_num, wire_type=wire_type, raw=data)

            nested = try_parse_message(data)
            if nested is not None:
                # Prefer message interpretation when the nested parse cleanly
                # consumes every byte and yields plausible field numbers. Very
                # short payloads that also happen to be valid strings are still
                # more likely strings, so we fall back in that case.
                if len(data) >= 2:
                    f.interpretation = "message"
                    f.nested = nested
                else:
                    s = looks_like_utf8(data)
                    if s is not None:
                        f.interpretation = "string"
                        f.string_value = s
                    else:
                        f.interpretation = "message"
                        f.nested = nested
            else:
                s = looks_like_utf8(data)
                if s is not None:
                    f.interpretation = "string"
                    f.string_value = s
                else:
                    f.interpretation = "bytes"
            yield f

        elif wire_type == WIRE_I32:
            if pos + 4 > len(buf):
                raise ValueError("i32 truncated")
            raw = buf[pos:pos + 4]
            f = Field(number=field_num, wire_type=wire_type, raw=raw,
                      fixed_value=struct.unpack("<i", raw)[0])
            pos += 4
            yield f

        else:
            raise ValueError(f"unsupported wire type {wire_type} at pos {pos}")


def decode(data: bytes) -> list:
    return list(_parse_fields(data))


# ---------- traversal ----------

def walk(fields, path=""):
    """Yield (path, field) for every field in the tree, depth-first."""
    for f in fields:
        p = f"{path}.{f.number}"
        yield p, f
        if f.interpretation == "message":
            yield from walk(f.nested, p)


def find_path(fields, target: str):
    """Return the field at a dotted path like '.1.5.2'. First match at each level."""
    parts = [int(x) for x in target.strip(".").split(".") if x]
    current_list = fields
    current = None
    for part in parts:
        current = None
        for f in current_list:
            if f.number == part:
                current = f
                break
        if current is None:
            return None
        current_list = current.nested if current.interpretation == "message" else []
    return current


# ---------- rendering ----------

def _short(s: str, n: int) -> str:
    if len(s) <= n:
        return s
    return s[:n] + f"... (+{len(s) - n} chars)"


def print_tree(fields, indent=0, path="", max_string_len=200, show_raw=False):
    prefix = "  " * indent
    for f in fields:
        p = f"{path}.{f.number}"
        wire = WIRE_NAMES.get(f.wire_type, "?")

        if f.wire_type == WIRE_VARINT:
            extra = f" = {f.varint_value}"
            if f.timestamp_hint:
                extra += f"   [{f.timestamp_hint}]"
            print(f"{prefix}{p}  ({wire}){extra}")

        elif f.wire_type in (WIRE_I32, WIRE_I64):
            print(f"{prefix}{p}  ({wire}) = {f.fixed_value}")

        elif f.wire_type == WIRE_LEN:
            if f.interpretation == "message":
                print(f"{prefix}{p}  (message, {len(f.raw)}B)")
                print_tree(f.nested, indent + 1, p, max_string_len, show_raw)
            elif f.interpretation == "string":
                display = _short(f.string_value, max_string_len).replace("\n", "\\n")
                print(f"{prefix}{p}  (string, {len(f.raw)}B) = {display!r}")
            else:  # bytes
                if show_raw:
                    print(f"{prefix}{p}  (bytes, {len(f.raw)}B) = {f.raw.hex()}")
                else:
                    head = f.raw[:16].hex()
                    print(f"{prefix}{p}  (bytes, {len(f.raw)}B) starts {head}...")


def dump_strings(fields, min_len=1):
    for path, f in walk(fields):
        if f.interpretation == "string" and len(f.string_value) >= min_len:
            display = f.string_value.replace("\n", "\\n")
            print(f"{path}\t({len(f.string_value)} chars)\t{display!r}")


# ---------- CLI ----------

def main():
    ap = argparse.ArgumentParser(description="Generic protobuf wire-format decoder.")
    ap.add_argument("file", help="binary payload to decode")
    ap.add_argument("--path", help="focus on a subtree, e.g. .1.5.2")
    ap.add_argument("--strings", action="store_true", help="dump all string fields")
    ap.add_argument("--raw", action="store_true", help="show full hex for opaque bytes fields")
    ap.add_argument("--max-string", type=int, default=200, help="truncate strings at N chars (default 200)")
    ap.add_argument("--min-string", type=int, default=1, help="with --strings, minimum length to print")
    args = ap.parse_args()

    with open(args.file, "rb") as fp:
        data = fp.read()

    print(f"# file: {args.file}  ({len(data)} bytes)")
    print(f"# first 16 bytes: {data[:16].hex()}")
    print()

    try:
        fields = decode(data)
    except Exception as e:
        print(f"ERROR: top-level decode failed: {e}", file=sys.stderr)
        sys.exit(1)

    if args.path:
        target = find_path(fields, args.path)
        if target is None:
            print(f"path {args.path} not found", file=sys.stderr)
            sys.exit(2)
        print(f"# subtree at {args.path}")
        if target.interpretation == "message":
            print_tree(target.nested, path=args.path,
                       max_string_len=args.max_string, show_raw=args.raw)
        else:
            parent = args.path.rsplit(".", 1)[0]
            print_tree([target], path=parent,
                       max_string_len=args.max_string, show_raw=args.raw)
        return

    if args.strings:
        dump_strings(fields, min_len=args.min_string)
        return

    print_tree(fields, max_string_len=args.max_string, show_raw=args.raw)


if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""
db.py — Survey an Antigravity conversation database.

Walks the `steps` table and, for each row, decodes the top-level protobuf
enum to classify what kind of step it is. Groups by type so we can pick a
small representative payload of each kind for deeper inspection with
protobuf.py.

Usage:
    python3 db.py summary <db-path>
    python3 db.py extract <db-path> <idx> <output.bin>
"""

import sys
import sqlite3
import argparse
from collections import defaultdict

# Import from the sibling file
from protobuf import decode, WIRE_VARINT, WIRE_LEN


def step_type(payload: bytes):
    """Top-level field .1 varint value, or None if absent/unparseable."""
    try:
        fields = decode(payload)
    except Exception:
        return None
    for f in fields:
        if f.number == 1 and f.wire_type == WIRE_VARINT:
            return f.varint_value
    return None


def top_level_field_numbers(payload: bytes):
    """Set of top-level field numbers present, e.g. {1, 4, 5, 14}."""
    try:
        fields = decode(payload)
    except Exception:
        return None
    return tuple(sorted({f.number for f in fields}))


def cmd_summary(args):
    con = sqlite3.connect(args.db)
    rows = con.execute(
        "SELECT idx, length(step_payload), step_payload FROM steps ORDER BY idx"
    ).fetchall()

    print(f"# db: {args.db}")
    print(f"# {len(rows)} steps\n")

    # Per-step table
    print(f"{'idx':>5}  {'size':>12}  {'type':>5}  top_fields")
    print("-" * 60)
    for idx, size, payload in rows:
        t = step_type(payload)
        shape = top_level_field_numbers(payload)
        shape_str = ",".join(str(n) for n in shape) if shape else "PARSE_FAIL"
        print(f"{idx:>5}  {size:>12,}  {t!s:>5}  [{shape_str}]")

    # Grouping
    by_type = defaultdict(list)
    by_shape = defaultdict(list)
    for idx, size, payload in rows:
        by_type[step_type(payload)].append((idx, size))
        by_shape[top_level_field_numbers(payload)].append((idx, size))

    print(f"\n# step-type distribution (top-level .1 varint):")
    print(f"{'type':>6}  {'count':>5}  {'smallest':>18}  {'largest':>18}")
    print("-" * 60)
    for t, items in sorted(by_type.items(),
                           key=lambda x: (x[0] is None, x[0] if x[0] is not None else -1)):
        by_size = sorted(items, key=lambda x: x[1])
        smallest = by_size[0]
        largest = by_size[-1]
        print(f"  {t!s:>4}  {len(items):>5}  "
              f"idx {smallest[0]:>4} ({smallest[1]:>7,}B)  "
              f"idx {largest[0]:>4} ({largest[1]:>7,}B)")

    print(f"\n# top-level shape distribution (which field numbers are present):")
    for shape, items in sorted(by_shape.items(), key=lambda x: -len(x[1])):
        smallest = min(items, key=lambda x: x[1])
        shape_str = ",".join(str(n) for n in shape) if shape else "PARSE_FAIL"
        print(f"  [{shape_str}]  count={len(items):>4}  smallest=idx {smallest[0]} ({smallest[1]:,}B)")


def cmd_extract(args):
    con = sqlite3.connect(args.db)
    row = con.execute(
        "SELECT step_payload FROM steps WHERE idx=?", (args.idx,)
    ).fetchone()
    if row is None:
        print(f"idx {args.idx} not found", file=sys.stderr)
        sys.exit(1)
    with open(args.out, "wb") as fp:
        fp.write(row[0])
    print(f"wrote {len(row[0])} bytes to {args.out}")


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("summary", help="table + type/shape distribution for whole DB")
    s.add_argument("db")
    s.set_defaults(func=cmd_summary)

    e = sub.add_parser("extract", help="write a single step's payload to a file")
    e.add_argument("db")
    e.add_argument("idx", type=int)
    e.add_argument("out")
    e.set_defaults(func=cmd_extract)

    args = ap.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
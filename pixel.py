#!/usr/bin/env python3

import re
import sys
from collections import Counter

if len(sys.argv) != 2:
    print("Usage:")
    print("python inspect_payload.py payload.bin")
    sys.exit(1)

path = sys.argv[1]

with open(path, "rb") as f:
    data = f.read()

print("=" * 60)
print(f"File: {path}")
print(f"Size: {len(data):,} bytes")
print("=" * 60)

# Find printable UTF-8 strings
pattern = rb"[ -~]{4,}"

strings = [m.decode("utf-8", errors="ignore")
           for m in re.findall(pattern, data)]

print(f"\nFound {len(strings)} printable strings.\n")

interesting = []

keywords = [
    "tool",
    "user",
    "assistant",
    "model",
    "claude",
    "gemini",
    "prompt",
    "grep",
    "bash",
    "edit",
    "write",
    "read",
    "replace",
    "invoke",
    "directory",
    "file",
]

for s in strings:
    lower = s.lower()
    if any(k in lower for k in keywords):
        interesting.append(s)

print("=" * 60)
print("Interesting strings")
print("=" * 60)

for s in interesting[:500]:
    print(s)

print("\n")

counter = Counter()

for s in interesting:
    for k in keywords:
        if k in s.lower():
            counter[k] += 1

print("=" * 60)
print("Keyword counts")
print("=" * 60)

for k, v in counter.most_common():
    print(f"{k:12} {v}")
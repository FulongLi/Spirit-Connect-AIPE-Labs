"""Expose only a reviewed GitHub repository/immutable revision to build CI."""
import json
import os
from pathlib import Path
import re

root=Path(__file__).resolve().parents[1]
record=json.loads((root/"_data/ecosystem-lock.json").read_text(encoding="utf-8"))["sources"]["academy"]
repo=record["checkout_repository"]
revision=record["revision"]
if record["dirty"] or not re.fullmatch(r"[\w.-]+/[\w.-]+",repo or "") or not re.fullmatch(r"[a-f0-9]{40}",revision or ""):
    raise SystemExit("Academy must be published at a clean, immutable GitHub revision before CI sync")
with open(os.environ["GITHUB_OUTPUT"],"a",encoding="utf-8") as stream:
    stream.write(f"repository={repo}\nrevision={revision}\n")

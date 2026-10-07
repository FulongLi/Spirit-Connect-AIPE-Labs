"""Regenerate Academy presentation at build time from the locked checkout."""
from pathlib import Path
import shutil
import sys
import tempfile

from sync_ecosystem import LOCK, ROOT, make_plan, read_json, source_bytes

academy=Path(sys.argv[1]).resolve()
lock=read_json(ROOT/LOCK)
with tempfile.TemporaryDirectory() as folder:
    registry=Path(folder)
    (registry/"generated").mkdir()
    for name in ("aipe.json","aipe.md"):
        shutil.copyfile(ROOT/name,registry/"generated"/name)
    plan=make_plan(registry,academy)
    for relative,content in plan.items():
        if relative == LOCK:
            continue
        path=ROOT/relative
        if relative not in lock["artifacts"] or not path.exists() or source_bytes(path)!=content:
            raise SystemExit(f"Source/output drift: regenerate and review {relative}")
    for relative,content in plan.items():
        if relative.startswith(("academy/","assets/academy/")):
            (ROOT/relative).write_bytes(content)
print("Academy regenerated from pinned source; all artifacts match reviewed output")

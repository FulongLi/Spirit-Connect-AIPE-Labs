"""Regenerate Academy presentation at build time from the locked checkout."""
from pathlib import Path
import shutil
import sys
import tempfile

from sync_ecosystem import LOCK, ROOT, digest, make_plan, provenance, read_json, source_bytes, verify_plan_set

academy=Path(sys.argv[1]).resolve()
lock=read_json(ROOT/LOCK)
source_lock=lock["sources"]["academy"]
observed=provenance(academy)
if not source_lock["revision"] or observed["revision"] != source_lock["revision"] or observed["dirty"]:
    raise SystemExit("Academy checkout must match the exact clean revision in the source lock")
if digest(source_bytes(academy/"generated/lessons.json")) != source_lock["catalogue_sha256"]:
    raise SystemExit("Academy catalogue differs from the source lock")
with tempfile.TemporaryDirectory() as folder:
    registry=Path(folder)
    (registry/"generated").mkdir()
    for name in ("aipe.json","aipe.md"):
        shutil.copyfile(ROOT/name,registry/"generated"/name)
    plan=make_plan(registry,academy)
    verify_plan_set(plan,lock)
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

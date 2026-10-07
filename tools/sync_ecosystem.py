"""Build presentation artifacts from validated local Registry/Academy checkouts.

No remote fetching or source execution occurs. Review and pin checkout revisions
before running; --check verifies the committed presentation without the sources.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
from pathlib import Path
from urllib.parse import unquote, urlsplit

import yaml

ROOT = Path(__file__).resolve().parents[1]
LOCK = "_data/ecosystem-lock.json"


def digest(data):
    return hashlib.sha256(data).hexdigest()


def source_bytes(path):
    if path.suffix.lower() in {".json", ".md", ".svg", ".m", ".cir", ".yaml", ".yml", ".txt", ".py"}:
        return path.read_text(encoding="utf-8").encode("utf-8")
    return path.read_bytes()


def confined(root, relative):
    root = root.resolve()
    path = (root / relative).resolve()
    if not path.is_relative_to(root) or path == root:
        raise ValueError(f"Path escapes source root: {relative}")
    return path


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def provenance(root):
    revision = subprocess.run(["git", "rev-parse", "HEAD"], cwd=root, capture_output=True, text=True)
    dirty = subprocess.run(["git", "status", "--porcelain"], cwd=root, capture_output=True, text=True)
    branch = subprocess.run(["git", "branch", "--show-current"], cwd=root, capture_output=True, text=True)
    tracking = subprocess.run(["git", "config", f"branch.{branch.stdout.strip()}.remote"], cwd=root, capture_output=True, text=True)
    remote = subprocess.run(["git", "remote", "get-url", tracking.stdout.strip() or "origin"], cwd=root, capture_output=True, text=True)
    match = re.fullmatch(r"https://github.com/([\w.-]+/[\w.-]+?)(?:\.git)?", remote.stdout.strip())
    return {"revision": revision.stdout.strip() if revision.returncode == 0 else None,
            "checkout_repository": match[1] if match else None,
            "dirty": bool(dirty.stdout.strip()) if dirty.returncode == 0 else None}


def encode_json(obj):
    return (json.dumps(obj, indent=2, ensure_ascii=False, sort_keys=True)+"\n").encode("utf-8")


def page(metadata, body):
    return ("---\n"+yaml.safe_dump(metadata, sort_keys=True, allow_unicode=True)+"---\n\n"+body).encode("utf-8")


def make_plan(registry, academy):
    registry, academy = registry.resolve(), academy.resolve()
    index_bytes = source_bytes(registry / "generated/aipe.json")
    index = json.loads(index_bytes)
    if index.get("schema_version") != "0.1.0" or not index.get("capabilities"):
        raise ValueError("Missing or incompatible Registry output")
    ids = [r["id"] for r in index["capabilities"]]
    if ids != sorted(set(ids)):
        raise ValueError("Registry capabilities must have unique sorted IDs")
    catalogue = read_json(academy / "generated/lessons.json")
    if catalogue.get("schema_version") != "0.1.0" or not catalogue.get("lessons"):
        raise ValueError("Missing or incompatible Academy output")
    lessons = catalogue["lessons"]
    by_source, by_slug, urls = {}, {}, set()
    for lesson in lessons:
        slug, domain = lesson["slug"], lesson["domain"]
        if not re.fullmatch(r"[a-z][a-z0-9-]*", slug) or not re.fullmatch(r"[a-z][a-z0-9-]*", domain):
            raise ValueError("Unsafe lesson slug/domain")
        expected_url = f"/academy/{domain}/{slug}/"
        if lesson["url"] != expected_url or slug in by_slug or expected_url in urls:
            raise ValueError("Duplicate or unstable lesson URL")
        source = confined(academy, lesson["source"])
        if source in by_source:
            raise ValueError("Duplicate canonical lesson source")
        if digest(source_bytes(source)) != lesson["sha256"]:
            raise ValueError(f"Stale lesson hash: {slug}")
        by_source[source], by_slug[slug] = lesson, lesson
        urls.add(expected_url)
    for lesson in lessons:
        for reference in lesson["prerequisites"] + lesson["next"]:
            if reference not in by_slug:
                raise ValueError(f"Broken curriculum reference: {reference}")

    plan = {"aipe.json": index_bytes, "aipe.md": source_bytes(registry / "generated/aipe.md")}
    source_hashes = {}

    def link_target(target, source):
        if not target or target.startswith(("#", "/", "http://", "https://", "mailto:")):
            return target
        parts = urlsplit(target)
        if parts.scheme or parts.netloc:
            raise ValueError(f"Unsupported link scheme: {target}")
        relative = unquote(parts.path)
        resolved = (source.parent / relative).resolve()
        if not resolved.is_relative_to(academy) or not resolved.is_file():
            raise ValueError(f"Missing/unsafe lesson link: {source.name}: {target}")
        suffix = ("?"+parts.query if parts.query else "") + ("#"+parts.fragment if parts.fragment else "")
        if resolved in by_source:
            return by_source[resolved]["url"] + suffix
        rel = resolved.relative_to(academy).as_posix()
        if rel.startswith("assets/"):
            allowed = {".svg", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".pdf", ".m", ".cir", ".json", ".csv", ".txt"}
            if resolved.suffix.lower() not in allowed:
                raise ValueError(f"Unsupported imported asset type: {rel}")
            asset = source_bytes(resolved)
            if resolved.suffix.lower() in {".svg", ".m", ".cir", ".json", ".csv", ".txt"}:
                text = asset.decode("utf-8")
                if text.lstrip("\ufeff \t\r\n").startswith("---") or "{%" in text or "{{" in text:
                    raise ValueError(f"Executable template syntax in imported asset: {rel}")
                if resolved.suffix.lower() == ".svg" and re.search(r"<\s*(?:script|foreignObject)\b|\bon\w+\s*=|(?:href|src)\s*=\s*['\"]\s*javascript:", text, re.I):
                    raise ValueError(f"Active SVG content in imported asset: {rel}")
            dest = "assets/academy/"+rel.removeprefix("assets/")
            plan[dest] = asset
            source_hashes[rel] = digest(plan[dest])
            return "/"+dest+suffix
        # Supporting reviews/prompts remain linked to their canonical repository.
        return "https://github.com/FulongLi/AIPE-Academy/blob/main/"+rel+suffix

    for lesson in sorted(lessons, key=lambda row: row["slug"]):
        source = confined(academy, lesson["source"])
        body = source.read_text(encoding="utf-8")
        if "{%" in body or "{{" in body:
            raise ValueError(f"Unsupported Liquid in imported source: {lesson['source']}")
        if body.startswith("---\n"):
            raise ValueError("v0.1 uses sidecar metadata; source front matter needs explicit conversion")
        body = re.sub(r"^# [^\n]+\n+", "", body, count=1)
        body = re.sub(r"(!?\[[^\]]*\]\()([^\s)]+)(\))", lambda m: m[1]+link_target(m[2],source)+m[3], body)
        meta = {"layout":"academy", "title":lesson["title"], "permalink":lesson["url"],
                "lang":"zh" if lesson["language"].startswith("zh") else "en", "math":True,
                "academy_page":True, "render_with_liquid":False, "lesson_status":lesson["status"],
                "en_url":"/academy/", "zh_url":"/academy/foundations/prerequisite-path-zh/",
                "lesson_type":lesson["type"], "estimated_time":lesson["estimated_time"],
                "source_path":lesson["source"], "source_sha256":lesson["sha256"],
                "prerequisite_links":[{"title":by_slug[s]["title"],"url":by_slug[s]["url"]} for s in lesson["prerequisites"]],
                "next_links":[{"title":by_slug[s]["title"],"url":by_slug[s]["url"]} for s in lesson["next"]]}
        plan[f"academy/{lesson['slug']}.md"] = page(meta, body)
        source_hashes[lesson["source"]] = lesson["sha256"]
    rows = ["AIPE means **AI for Power Engineering**. Power electronics is the primary v0.1 curriculum.",
            "", "Start with orientation and the foundation bridge. Outlines describe planned coverage; available lessons and labs provide actual study activities.", "",
            "| Lesson | Type | Status | Suggested minutes |", "| --- | --- | --- | --- |"]
    for lesson in sorted(lessons,key=lambda x:x["source"]):
        title = lesson["title"].replace("|","\\|")
        rows.append(f"| [{title}]({lesson['url']}) | {lesson['type']} | {lesson['status']} | {lesson['estimated_time']} |")
    rows.extend(["", "Core practice uses open tools. Commercial variants are optional. [Discover AIPE capabilities](/aipe.md).", ""])
    plan["academy/index.md"] = page({"layout":"academy","title":"AIPE Academy","permalink":"/academy/","academy_page":True,"lang":"en","en_url":"/academy/","zh_url":"/academy/foundations/prerequisite-path-zh/"},"\n".join(rows))
    lock = {"schema_version":"0.1.0", "sources":{
        "registry":{"repository":"FulongLi/AIPE-Registry", **provenance(registry), "aipe_json_sha256":digest(index_bytes)},
        "academy":{"repository":"FulongLi/AIPE-Academy", **provenance(academy), "catalogue_sha256":digest(source_bytes(academy/"generated/lessons.json")), "files":dict(sorted(source_hashes.items()))}},
        "artifacts":{path:digest(content) for path,content in sorted(plan.items())}}
    plan[LOCK] = encode_json(lock)
    return plan


def allowed_output(relative):
    return relative in {"aipe.json", "aipe.md", LOCK} or relative.startswith(("academy/", "assets/academy/"))


def write_plan(plan, output):
    # Validate the entire plan before writing any output.
    for relative in plan:
        confined(output, relative)
        if not allowed_output(relative):
            raise ValueError(f"Not a managed output: {relative}")
    previous = output/LOCK
    if previous.exists():
        stale = set(read_json(previous)["artifacts"])-set(plan)
        if stale:
            raise ValueError(f"Retired public pages need a reviewed redirect before sync: {sorted(stale)}")
    for relative, content in sorted(plan.items()):
        target = confined(output,relative)
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_bytes(content)


def verify(output):
    lock = read_json(output/LOCK)
    if lock.get("schema_version") != "0.1.0" or not lock.get("artifacts"):
        raise ValueError("Missing presentation lock")
    if not {"aipe.json","aipe.md","academy/index.md"}.issubset(lock["artifacts"]):
        raise ValueError("Incomplete public endpoint set")
    for relative, sha in lock["artifacts"].items():
        path = confined(output,relative)
        if not allowed_output(relative) or not path.is_file() or digest(path.read_bytes()) != sha:
            raise ValueError(f"Generated artifact drift: {relative}")
    return len(lock["artifacts"])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--registry",type=Path)
    parser.add_argument("--academy",type=Path)
    parser.add_argument("--output",type=Path,default=ROOT)
    parser.add_argument("--check",action="store_true")
    args = parser.parse_args()
    try:
        if args.check:
            print(f"Verified {verify(args.output)} generated presentation artifacts")
        elif args.registry and args.academy:
            plan=make_plan(args.registry,args.academy)
            write_plan(plan,args.output)
            print(f"Synced {len(plan)-1} artifacts; inspect source revisions and diff before committing")
        else:
            parser.error("Provide --registry and --academy, or --check")
    except (OSError,ValueError,KeyError) as exc:
        parser.exit(1,f"error: {exc}\n")


if __name__ == "__main__":
    main()

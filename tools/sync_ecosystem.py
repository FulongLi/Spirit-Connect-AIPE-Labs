"""Build presentation artifacts from validated local Registry/Academy checkouts.

No remote fetching or source execution occurs. Review and pin checkout revisions
before running; --check verifies the committed presentation without the sources.

Academy inputs (generated, versioned metadata of the pinned checkout):
  generated/lessons.json              lesson records (schema 0.1.0 or 0.2.0)
  generated/knowledge-graph.json      domains, tracks, modules, learning paths (0.2.0)
  generated/academic-references.json  MIT OpenCourseWare reference baseline (0.2.0)

Managed outputs:
  academy/<slug>.md, academy/index.md, assets/academy/**   lesson pages and teaching assets
  _data/knowledge_graph.yml          topics for the interactive knowledge graph, generated from
                                     the Academy graph plus the site-owned links in
                                     _data/knowledge_graph_resources.yml
  _data/academic_references.json     verbatim copy of the Academy reference projection
  _data/academy_graph.json           verbatim copy of the Academy knowledge graph
  aipe.json, aipe.md                 Registry endpoints
  _data/ecosystem-lock.json          provenance and hashes of everything above
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
GRAPH_OUT = "_data/knowledge_graph.yml"
REFERENCES_OUT = "_data/academic_references.json"
ACADEMY_GRAPH_OUT = "_data/academy_graph.json"
RESOURCES_OVERLAY = "_data/knowledge_graph_resources.yml"
SUPPORTED_CATALOGUES = {"0.1.0", "0.2.0"}
CANONICAL_ACADEMY = "FulongLi/AIPE-Academy"
SITE_LANGUAGE = {"en": "en", "zh-CN": "zh"}


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


def github_blob(path):
    return f"https://github.com/{CANONICAL_ACADEMY}/blob/main/{path}"


def load_overlay(site):
    path = Path(site) / RESOURCES_OVERLAY
    if not path.is_file():
        return {}
    overlay = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    if not isinstance(overlay, dict):
        raise ValueError(f"{RESOURCES_OVERLAY} must map topic ids to resource lists")
    return overlay


def render_knowledge_graph(graph, lessons_by_slug, overlay):
    """Topics for the interactive knowledge graph, in Academy module order."""
    modules = {m["id"] for m in graph["modules"]}
    for ident in overlay:
        if ident not in modules:
            raise ValueError(f"{RESOURCES_OVERLAY} names unknown topic {ident}")
    nodes = []
    for module in graph["modules"]:
        node = {
            "id": module["id"],
            "subject": module["domain"],
            "track": module["track"],
        }
        if module.get("parent"):
            node["parent"] = module["parent"]
        node["title"] = {"en": module["title"]["en"], "zh": module["title"]["zh"]}
        node["summary"] = {"en": module["summary"]["en"], "zh": module["summary"]["zh"]}
        node["status"] = module["status"]
        if module["requires"]:
            node["requires"] = list(module["requires"])
        if module["related"]:
            node["related"] = list(module["related"])
        lessons = [lessons_by_slug[s]["url"] for s in module["lessons"] if s in lessons_by_slug]
        if lessons:
            node["lessons"] = lessons
        if overlay.get(module["id"]):
            node["resources"] = overlay[module["id"]]
        nodes.append(node)
    header = (
        "# AIPE Academy engineering knowledge graph (GENERATED; do not edit).\n"
        "#\n"
        "# Regenerated by tools/sync_ecosystem.py from the pinned AIPE Academy revision's\n"
        "# generated/knowledge-graph.json: topics are Academy module ids, subjects are\n"
        "# Academy domain ids (the Academy stages in _data/academy.yml), `requires` and\n"
        "# `related` are the Academy's learning dependencies, `lessons` are the generated\n"
        "# lesson URLs attached to each module and `status` is the Academy's coverage\n"
        "# status (available, draft, outline or planned). `resources` are the website's\n"
        "# own links from _data/knowledge_graph_resources.yml; edit that file, then\n"
        "# re-run the sync. tools/hub_data.py validates labels, references and cycles.\n\n"
    )
    body = yaml.safe_dump({"nodes": nodes}, sort_keys=False, allow_unicode=True, width=1000)
    return (header + body).encode("utf-8")


def make_plan(registry, academy, site=ROOT):
    registry, academy = registry.resolve(), academy.resolve()
    index_bytes = source_bytes(registry / "generated/aipe.json")
    index = json.loads(index_bytes)
    if index.get("schema_version") != "0.1.0" or not index.get("capabilities"):
        raise ValueError("Missing or incompatible Registry output")
    ids = [r["id"] for r in index["capabilities"]]
    if ids != sorted(set(ids)):
        raise ValueError("Registry capabilities must have unique sorted IDs")
    catalogue = read_json(academy / "generated/lessons.json")
    version = catalogue.get("schema_version")
    if version not in SUPPORTED_CATALOGUES or not catalogue.get("lessons"):
        raise ValueError("Missing or incompatible Academy output")
    lessons = catalogue["lessons"]
    graph = references = None
    if version != "0.1.0":
        graph = read_json(academy / "generated/knowledge-graph.json")
        references = read_json(academy / "generated/academic-references.json")
        if graph.get("schema_version") != version or references.get("schema_version") != version:
            raise ValueError("Academy generated files disagree on schema version")
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
        for lab in lesson.get("labs", []):
            if not re.fullmatch(r"labs/[A-Za-z0-9_./-]+\.py", lab) or not confined(academy, lab).is_file():
                raise ValueError(f"Missing or unsafe lab script: {lab}")
    known_references = {c["id"] for c in references["courses"]} if references else set()
    for lesson in lessons:
        for ref in lesson.get("academic_references", []):
            if ref not in known_references:
                raise ValueError(f"Lesson {lesson['slug']} cites unknown academic reference {ref}")

    plan = {"aipe.json": index_bytes, "aipe.md": source_bytes(registry / "generated/aipe.md")}
    source_hashes = {}
    academy_provenance = provenance(academy)

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
                if text.lstrip("﻿ \t\r\n").startswith("---") or "{%" in text or "{{" in text:
                    raise ValueError(f"Executable template syntax in imported asset: {rel}")
                if resolved.suffix.lower() == ".svg" and re.search(r"<\s*(?:script|foreignObject)\b|\bon\w+\s*=|(?:href|src)\s*=\s*['\"]\s*javascript:", text, re.I):
                    raise ValueError(f"Active SVG content in imported asset: {rel}")
            dest = "assets/academy/"+rel.removeprefix("assets/")
            plan[dest] = asset
            source_hashes[rel] = digest(plan[dest])
            return "/"+dest+suffix
        # Supporting reviews, prompts, labs and code remain linked to their canonical repository.
        return github_blob(rel)+suffix

    for lesson in sorted(lessons, key=lambda row: row["slug"]):
        source = confined(academy, lesson["source"])
        body = source.read_text(encoding="utf-8")
        if "{%" in body or "{{" in body:
            raise ValueError(f"Unsupported Liquid in imported source: {lesson['source']}")
        if body.startswith("---\n"):
            raise ValueError("Academy uses sidecar metadata; source front matter needs explicit conversion")
        body = re.sub(r"^# [^\n]+\n+", "", body, count=1)
        body = re.sub(r"(!?\[[^\]]*\]\()([^\s)]+)(\))", lambda m: m[1]+link_target(m[2],source)+m[3], body)
        lang = SITE_LANGUAGE.get(lesson["language"], "zh" if lesson["language"].startswith("zh") else "en")
        translations = {}
        for language, slug in (lesson.get("translations") or {}).items():
            site_lang = SITE_LANGUAGE.get(language)
            if site_lang and slug and slug in by_slug:
                translations[site_lang] = by_slug[slug]["url"]
        meta = {"layout":"academy", "title":lesson["title"], "permalink":lesson["url"],
                "lang":lang, "math":True,
                "academy_page":True, "render_with_liquid":False, "lesson_status":lesson["status"],
                "en_url":translations.get("en", "/academy/"), "zh_url":translations.get("zh", "/zh/academy/"),
                "lesson_type":lesson["type"], "estimated_time":lesson["estimated_time"],
                "source_path":lesson["source"], "source_sha256":lesson["sha256"],
                "prerequisite_links":[{"title":by_slug[s]["title"],"url":by_slug[s]["url"]} for s in lesson["prerequisites"]],
                "next_links":[{"title":by_slug[s]["title"],"url":by_slug[s]["url"]} for s in lesson["next"]],
                "canonical_source_url":github_blob(lesson["source"]),
                "source_revision":academy_provenance["revision"],
                "translations":{"en":translations.get("en"), "zh":translations.get("zh")}}
        if version != "0.1.0":
            meta.update({
                "domain":lesson["domain"], "track":lesson["track"], "module":lesson["module"], "level":lesson["level"],
                "covers":lesson.get("covers", []), "concept":lesson["concept"],
                "translation_status":lesson.get("translation_status", "original"), "lesson_format":lesson.get("format", "legacy"),
                "labs":lesson.get("labs", []), "lab_urls":[github_blob(lab) for lab in lesson.get("labs", [])],
                "academic_references":lesson.get("academic_references", []),
            })
        plan[f"academy/{lesson['slug']}.md"] = page(meta, body)
        source_hashes[lesson["source"]] = lesson["sha256"]
    rows = ["AIPE means **AI for Power Engineering**. Power electronics is the primary v0.1 curriculum.",
            "", "Start with orientation and the foundation bridge. Outlines describe planned coverage; available lessons and labs provide actual study activities.", "",
            "| Lesson | Type | Status | Suggested minutes |", "| --- | --- | --- | --- |"]
    for lesson in sorted(lessons,key=lambda x:x["source"]):
        title = lesson["title"].replace("|","\\|")
        rows.append(f"| [{title}]({lesson['url']}) | {lesson['type']} | {lesson['status']} | {lesson['estimated_time']} |")
    rows.extend(["", "Core practice uses open tools. Commercial variants are optional. [Discover AIPE capabilities](/aipe.md).", ""])
    plan["academy/index.md"] = page({"layout":"academy","title":"AIPE Academy","permalink":"/academy/","academy_page":True,"lang":"en","en_url":"/academy/","zh_url":"/zh/academy/"},"\n".join(rows))
    academy_lock = {"repository":CANONICAL_ACADEMY, **academy_provenance, "catalogue_sha256":digest(source_bytes(academy/"generated/lessons.json")), "catalogue_schema":version, "files":None}
    if graph is not None:
        graph_bytes = source_bytes(academy / "generated/knowledge-graph.json")
        references_bytes = source_bytes(academy / "generated/academic-references.json")
        plan[ACADEMY_GRAPH_OUT] = graph_bytes
        plan[REFERENCES_OUT] = references_bytes
        plan[GRAPH_OUT] = render_knowledge_graph(graph, by_slug, load_overlay(site))
        academy_lock["graph_sha256"] = digest(graph_bytes)
        academy_lock["references_sha256"] = digest(references_bytes)
    academy_lock["files"] = dict(sorted(source_hashes.items()))
    lock = {"schema_version":"0.1.0", "sources":{
        "registry":{"repository":"FulongLi/AIPE-Registry", **provenance(registry), "aipe_json_sha256":digest(index_bytes)},
        "academy":academy_lock},
        "artifacts":{path:digest(content) for path,content in sorted(plan.items())}}
    plan[LOCK] = encode_json(lock)
    return plan


def allowed_output(relative):
    return relative in {"aipe.json", "aipe.md", LOCK, GRAPH_OUT, REFERENCES_OUT, ACADEMY_GRAPH_OUT} or relative.startswith(("academy/", "assets/academy/"))


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


def verify_plan_set(plan, lock):
    if set(plan) - {LOCK} != set(lock["artifacts"]):
        raise ValueError("Generated artifact set differs from the reviewed source lock")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--registry",type=Path)
    parser.add_argument("--academy",type=Path)
    parser.add_argument("--output",type=Path,default=ROOT)
    parser.add_argument("--check",action="store_true")
    args = parser.parse_args()
    try:
        if args.check:
            print(f"Verified {verify(args.output)} generated presentation artifacts")
        elif args.registry and args.academy:
            plan=make_plan(args.registry,args.academy,args.output)
            write_plan(plan,args.output)
            print(f"Synced {len(plan)-1} artifacts; inspect source revisions and diff before committing")
        else:
            parser.error("Provide --registry and --academy, or --check")
    except (OSError,ValueError,KeyError) as exc:
        parser.exit(1,f"error: {exc}\n")


if __name__ == "__main__":
    main()

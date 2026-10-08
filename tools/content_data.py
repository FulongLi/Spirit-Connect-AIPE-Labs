"""Validate AIPE Explorations entries and the article ownership map.

  python tools/content_data.py --check

Explorations (_explorations/*.md, _explorations/zh/*.md) must:
  - use a status, evidence kinds and domains defined in the shared data files;
  - record the evidence their status claims (a status is never self-asserted);
  - contain the eight required sections, in order, in their own language;
  - link only Hub artifacts that exist and pages that resolve in their language;
  - keep the same status as their translation, when one exists.

_data/blog-ownership.json must list every post exactly once, with an allowed
category, a destination for that category and a valid migration state; LEARN
posts name the Academy stage they map to, and migrated posts carry the canonical
Academy notice.
"""
from __future__ import annotations

import argparse
import datetime
import importlib.util
import json
import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
EXPLORATIONS = "_explorations"
EXPLORATION_DATA = "_data/explorations.yml"
OWNERSHIP = "_data/blog-ownership.json"
LANGUAGES = ("en", "zh")
REQUIRED = ("title", "lang", "permalink", "translation_key", "status", "question", "description",
            "domains", "opened", "updated", "evidence", "hub", "ai_disclosure")

_spec = importlib.util.spec_from_file_location("hub_data", Path(__file__).with_name("hub_data.py"))
hub_data = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(hub_data)


def split_front_matter(path):
    text = path.read_text(encoding="utf-8")
    parts = text.split("---", 2)
    if not text.startswith("---") or len(parts) != 3:
        return None, text
    return yaml.safe_load(parts[1]) or {}, parts[2]


def exploration_files(root):
    folder = root/EXPLORATIONS
    return sorted(folder.glob("*.md")) + sorted((folder/"zh").glob("*.md")) if folder.is_dir() else []


def hub_ids(hub):
    ids = set()
    for item in hub["artifacts"]:
        ids.update(item[key] for key in ("registry", "id", "academy") if key in item)
    return ids


def validate_explorations(root, hub, errors):
    data = hub_data.load_yaml(root, EXPLORATION_DATA)
    statuses = {s["key"]: s for s in data["statuses"]}
    kinds = {k["key"]: k for k in data["evidence_kinds"]}
    domains = {d["key"] for d in hub["domains"]}
    artifacts = hub_ids(hub)
    lessons = hub_data.academy_lessons(root)
    paths = hub_data.public_paths(root)
    for status in statuses.values():
        for field in ("label", "summary"):
            if set(status.get(field, {})) != set(LANGUAGES):
                errors.append(f"{EXPLORATION_DATA} status {status['key']}: {field} needs en and zh")
    pairs = {}
    for path in exploration_files(root):
        where = path.relative_to(root).as_posix()
        meta, body = split_front_matter(path)
        if meta is None:
            errors.append(f"{where}: missing front matter")
            continue
        missing = [field for field in REQUIRED if field not in meta]
        if missing:
            errors.append(f"{where}: missing {', '.join(missing)}")
            continue
        lang = meta["lang"]
        expected_lang = "zh" if path.parent.name == "zh" else "en"
        if lang != expected_lang:
            errors.append(f"{where}: lang must be {expected_lang} for this folder")
        prefix = "/zh/explorations/" if expected_lang == "zh" else "/explorations/"
        if meta["permalink"] != f"{prefix}{path.stem}/":
            errors.append(f"{where}: permalink must be {prefix}{path.stem}/")
        if meta["translation_key"] != path.stem:
            errors.append(f"{where}: translation_key must match the file name {path.stem}")
        for field in ("opened", "updated"):
            if not isinstance(meta[field], datetime.date):
                errors.append(f"{where}: {field} must be a date (YYYY-MM-DD)")
        if isinstance(meta["opened"], datetime.date) and isinstance(meta["updated"], datetime.date) and meta["updated"] < meta["opened"]:
            errors.append(f"{where}: updated precedes opened")
        unknown = set(meta["domains"] or []) - domains
        if not meta["domains"] or unknown:
            errors.append(f"{where}: needs known engineering domains (unknown: {sorted(unknown)})")

        # Evidence: every item is well formed, and the status is backed by it.
        recorded = set()
        for index, item in enumerate(meta["evidence"] or []):
            label = f"{where}: evidence[{index}]"
            kind = kinds.get(item.get("kind"))
            if not kind:
                errors.append(f"{label}: unknown kind {item.get('kind')}")
                continue
            recorded.add(kind["key"])
            if not item.get("summary") or not isinstance(item.get("date"), datetime.date):
                errors.append(f"{label}: needs a summary and a date")
            if kind.get("link") and not item.get("link"):
                errors.append(f"{label}: {kind['key']} evidence must link to its files or data")
            if kind.get("reviewer") and not item.get("reviewer"):
                errors.append(f"{label}: human-review evidence must name the reviewer")
            if item.get("link") and not str(item["link"]).startswith("http") and not hub_data.resolves(item["link"], paths):
                errors.append(f"{label}: unresolved link {item['link']}")
        status = statuses.get(meta["status"])
        if not status:
            errors.append(f"{where}: unknown status {meta['status']}")
        else:
            lacking = set(status.get("requires", [])) - recorded
            if lacking:
                errors.append(f"{where}: status {meta['status']} needs recorded {', '.join(sorted(lacking))} evidence")
            if status.get("requires_any") and not recorded & set(status["requires_any"]):
                errors.append(f"{where}: status {meta['status']} needs one of {', '.join(status['requires_any'])} evidence")
        if meta.get("featured") and not recorded:
            errors.append(f"{where}: only explorations with recorded evidence can be featured")

        # Body: the eight sections, in order, in the entry's language.
        headings = [h.strip() for h in re.findall(r"^## (.+)$", body, flags=re.M)]
        required = data["sections"].get(lang, [])
        positions = [headings.index(h) if h in headings else -1 for h in required]
        absent = [h for h, p in zip(required, positions) if p < 0]
        if absent:
            errors.append(f"{where}: missing sections {absent}")
        elif positions != sorted(positions):
            errors.append(f"{where}: required sections are out of order")

        # Links: Hub artifacts exist; background reading resolves in the same language.
        hub_links = meta["hub"] or {}
        for role in ("uses", "produces"):
            for ident in hub_links.get(role) or []:
                if ident not in artifacts:
                    errors.append(f"{where}: hub.{role} {ident} is not placed in _data/hub.yml")
        for link in meta.get("learn") or []:
            url = link.get("url", "")
            if not link.get("title") or not url:
                errors.append(f"{where}: learn links need a title and url")
                continue
            if not hub_data.resolves(url, paths):
                errors.append(f"{where}: unresolved learn URL {url}")
            lesson = lessons.get(url)
            other_language = lesson.get("lang", "en") != lang if lesson else (url.startswith("/zh/") != (lang == "zh"))
            if other_language:
                errors.append(f"{where}: learn URL {url} is not in {lang}")
        pairs.setdefault(meta["translation_key"], {})[lang] = (where, meta["status"])
    for key, versions in pairs.items():
        states = {status for _, status in versions.values()}
        if len(states) > 1:
            errors.append(f"exploration {key}: translations disagree on status {sorted(states)}")


def validate_ownership(root, academy, errors):
    ownership = json.loads((root/OWNERSHIP).read_text(encoding="utf-8"))
    categories = set(ownership["allowed_categories"])
    if set(ownership.get("destinations", {})) != categories:
        errors.append(f"{OWNERSHIP}: destinations must cover {sorted(categories)}")
    stages = {stage["key"] for stage in academy["stages"]}
    states = set(ownership.get("migration_states", {}))
    posts = {path.relative_to(root).as_posix() for path in (root/"_posts").rglob("*.md")}
    listed = {}
    for entry in ownership["posts"]:
        where = f"{OWNERSHIP} {entry['source']}"
        listed[entry["source"]] = listed.get(entry["source"], 0) + 1
        if entry["category"] not in categories:
            errors.append(f"{where}: unknown category {entry['category']}")
        if entry.get("migration_status") not in states:
            errors.append(f"{where}: unknown migration_status {entry.get('migration_status')}")
        if entry["category"] == "LEARN" and entry.get("academy_stage") not in stages:
            errors.append(f"{where}: LEARN posts need an academy_stage from _data/academy.yml")
        source = root/entry["source"]
        if not source.is_file():
            continue
        meta, _ = split_front_matter(source)
        if (meta or {}).get("lang", "en") != entry["language"]:
            errors.append(f"{where}: language does not match the post")
        if entry.get("migration_status") == "migrated":
            if entry["canonical_owner"] == "Spirit-Connect-AIPE-Labs" or not (meta or {}).get("academy_source"):
                errors.append(f"{where}: migrated posts need an external canonical owner and an academy_source notice")
    for source in sorted(posts - set(listed)):
        errors.append(f"{OWNERSHIP}: {source} is not classified")
    for source, count in listed.items():
        if count != 1:
            errors.append(f"{OWNERSHIP}: {source} is listed {count} times")
        if source not in posts:
            errors.append(f"{OWNERSHIP}: {source} does not exist")


def validate(root=ROOT):
    """Return a list of errors for Explorations and the ownership map."""
    errors = []
    hub = hub_data.load_yaml(root, hub_data.HUB)
    validate_explorations(root, hub, errors)
    validate_ownership(root, hub_data.load_yaml(root, hub_data.ACADEMY), errors)
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--check", action="store_true", required=True, help="validate without writing")
    parser.parse_args()
    errors = validate()
    if errors:
        parser.exit(1, "".join(f"error: {error}\n" for error in errors))
    print("Content verified: Explorations evidence, sections and links; article ownership map")


if __name__ == "__main__":
    main()

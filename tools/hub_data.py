"""Mirror the Registry index into Jekyll data and validate Hub presentation data.

GitHub Pages cannot read /aipe.json from Liquid, so _data/registry.json is a
byte-identical mirror of it. The mirror is presentation-owned and derived: it is
never edited by hand and never replaces aipe.json as the published endpoint.

  python tools/hub_data.py --write   # refresh the mirror after a Registry sync
  python tools/hub_data.py --check   # verify mirror and Hub/Academy mappings
"""
from __future__ import annotations

import argparse
import json
import os
import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = "aipe.json"
MIRROR = "_data/registry.json"
HUB = "_data/hub.yml"
ACADEMY = "_data/academy.yml"
SKIP_DIRS = {"_site", "vendor", ".git", ".jekyll-cache", ".bundle", "node_modules", "tools", "tests", "docs"}


def load_yaml(root, relative):
    return yaml.safe_load((root/relative).read_text(encoding="utf-8"))


def front_matter(path):
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return None
    parts = text.split("---", 2)
    if len(parts) != 3:
        return None
    return yaml.safe_load(parts[1]) or {}


def public_paths(root):
    """Every URL path the Jekyll build can serve, derived from source files."""
    paths = set()
    for folder, dirs, files in os.walk(root):
        top = Path(folder).relative_to(root).parts
        if not top:
            dirs[:] = [d for d in dirs if d not in SKIP_DIRS | {"_data", "_includes", "_layouts"} and not d.startswith(".")]
        for name in files:
            path = Path(folder)/name
            relative = path.relative_to(root)
            if len(relative.parts) == 1 and (name.startswith(".") or name in {"Gemfile", "Gemfile.lock", "README.md", "LICENSE.md", "requirements-dev.txt"}):
                continue
            if path.suffix in {".md", ".html"}:
                meta = front_matter(path)
                if meta is not None:
                    if meta.get("permalink"):
                        paths.add(meta["permalink"])
                    elif relative.parts[0] == "_posts":
                        slug = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", path.stem)
                        paths.add(f"/resources/blog/{slug}/")
                    continue
            if relative.parts[0] != "_posts":
                paths.add("/"+relative.as_posix())
    return paths


def resolves(url, paths):
    if url.startswith(("http://", "https://", "mailto:")):
        return True
    path = url.split("#", 1)[0].split("?", 1)[0]
    return path in paths


def academy_lessons(root):
    lessons = {}
    for path in sorted((root/"academy").glob("*.md")):
        meta = front_matter(path) or {}
        if meta.get("lesson_status"):
            lessons[meta["permalink"]] = meta
    return lessons


def validate(root=ROOT):
    """Return (errors, warnings) for the Hub and Academy presentation data."""
    errors, warnings = [], []
    if not (root/MIRROR).is_file() or (root/MIRROR).read_bytes() != (root/REGISTRY).read_bytes():
        errors.append(f"{MIRROR} differs from {REGISTRY}; run tools/hub_data.py --write")
    registry = {record["id"]: record for record in json.loads((root/REGISTRY).read_text(encoding="utf-8"))["capabilities"]}
    hub, academy = load_yaml(root, HUB), load_yaml(root, ACADEMY)
    paths, lessons = public_paths(root), academy_lessons(root)
    categories = {c["key"] for c in hub["categories"]} | {"platform"}
    domains = {d["key"] for d in hub["domains"]}
    languages = ("en", "zh")

    def check_url(url, where, localised=False):
        if not resolves(url, paths):
            errors.append(f"{where}: unresolved URL {url}")
        if localised and not url.startswith("http") and not resolves("/zh"+url, paths):
            errors.append(f"{where}: no Chinese counterpart for {url}")

    for group in ("categories", "domains"):
        for entry in hub[group]:
            for field in ("title", "summary"):
                if set(entry.get(field, {})) != set(languages):
                    errors.append(f"{group}.{entry['key']}: {field} needs en and zh")
            if entry.get("url"):
                check_url(entry["url"], f"{group}.{entry['key']}", localised=True)

    placed, featured = {}, []
    for index, item in enumerate(hub["artifacts"]):
        sources = [key for key in ("registry", "academy", "id") if key in item]
        where = f"artifacts[{index}] {item.get(sources[0]) if sources else ''}".strip()
        if len(sources) != 1:
            errors.append(f"{where}: needs exactly one of registry, academy or id")
            continue
        if item.get("category") not in categories:
            errors.append(f"{where}: unknown category {item.get('category')}")
        unknown = set(item.get("domains", [])) - domains
        if unknown:
            errors.append(f"{where}: unknown domains {sorted(unknown)}")
        if "featured" in item:
            featured.append(item["featured"])
        if "registry" in item:
            if item["registry"] not in registry:
                errors.append(f"{where}: not in {REGISTRY}")
            placed[item["registry"]] = placed.get(item["registry"], 0) + 1
        elif "academy" in item:
            if item["academy"] not in lessons:
                errors.append(f"{where}: no generated Academy lesson at this URL")
            if set(item.get("description", {})) != set(languages):
                errors.append(f"{where}: description needs en and zh")
        else:
            if not item["id"].startswith("site."):
                errors.append(f"{where}: website artifact IDs start with 'site.'")
            for field in ("title", "description"):
                if set(item.get(field, {})) != set(languages):
                    errors.append(f"{where}: {field} needs en and zh")
            if item.get("type") not in hub["type_labels"]:
                errors.append(f"{where}: unknown type {item.get('type')}")
            if item.get("status") not in hub["status_labels"]:
                errors.append(f"{where}: unknown status {item.get('status')}")
            if not item.get("url") and not item.get("files"):
                errors.append(f"{where}: needs a url or files")
            if item.get("url"):
                check_url(item["url"], where, item.get("localised", False))
            for file in item.get("files", []):
                if not (root/file.lstrip("/")).is_file():
                    errors.append(f"{where}: missing file {file}")
        for link in item.get("links", []):
            check_url(link["url"], where, link.get("localised", False))
    for capability in registry:
        if placed.get(capability, 0) != 1:
            errors.append(f"Registry capability {capability} must be placed exactly once in {HUB}")
    if len(featured) != len(set(featured)):
        errors.append("artifacts: featured positions must be unique")
    for record in registry.values():
        if record["type"] not in hub["type_labels"]:
            errors.append(f"type_labels: missing Registry type {record['type']}")
        if record["maturity"] not in hub["status_labels"]:
            errors.append(f"status_labels: missing Registry maturity {record['maturity']}")
    for meta in lessons.values():
        if meta["lesson_status"] not in hub["status_labels"]:
            errors.append(f"status_labels: missing Academy status {meta['lesson_status']}")

    staged = set()
    for stage in academy["stages"]:
        for url in stage["lessons"]:
            if url not in lessons:
                errors.append(f"academy stage {stage['key']}: no generated lesson at {url}")
            staged.add(url)
        unknown = set(stage.get("hub", [])) - domains
        if unknown:
            errors.append(f"academy stage {stage['key']}: unknown domains {sorted(unknown)}")
    for step in academy["hub_route"]:
        check_url(step["url"], f"academy hub_route {step['title']}")
    labs = {item["academy"] for item in hub["artifacts"] if "academy" in item}
    for url in sorted(set(lessons) - staged - labs):
        warnings.append(f"Academy lesson {url} is not in a stage; it will appear under 'More from the catalogue'")
    return errors, warnings


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    action = parser.add_mutually_exclusive_group(required=True)
    action.add_argument("--write", action="store_true", help="refresh the Registry mirror, then validate")
    action.add_argument("--check", action="store_true", help="validate without writing")
    args = parser.parse_args()
    if args.write:
        (ROOT/MIRROR).write_bytes((ROOT/REGISTRY).read_bytes())
    errors, warnings = validate()
    for warning in warnings:
        print(f"warning: {warning}")
    if errors:
        parser.exit(1, "".join(f"error: {error}\n" for error in errors))
    print("Hub data verified: Registry mirror, artifact placement and Academy paths")


if __name__ == "__main__":
    main()

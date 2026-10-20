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
AGENTS = "_data/agents.yml"
GRAPH = "_data/knowledge_graph.yml"
RESOURCES = "_data/knowledge_graph_resources.yml"
REFERENCES = "_data/academic_references.json"
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


def validate_graph(graph, subjects, lessons, check_resource, errors):
    """Knowledge graph: bilingual labels, real references and lessons, no prerequisite cycles."""
    nodes = graph.get("nodes", [])
    ids = [node.get("id") for node in nodes]
    known = set(ids)
    for ident in sorted({i for i in ids if ids.count(i) > 1}):
        errors.append(f"knowledge graph: duplicate node {ident}")
    for node in nodes:
        where = f"knowledge graph node {node.get('id')}"
        if node.get("subject") not in subjects:
            errors.append(f"{where}: unknown subject {node.get('subject')}")
        for field in ("title", "summary"):
            if set(node.get(field, {})) != {"en", "zh"}:
                errors.append(f"{where}: {field} needs en and zh")
        for field in ("requires", "related"):
            for ref in node.get(field, []) or []:
                if ref not in known:
                    errors.append(f"{where}: {field} unknown topic {ref}")
                elif ref == node.get("id"):
                    errors.append(f"{where}: {field} refers to itself")
        if node.get("parent") and node["parent"] not in known:
            errors.append(f"{where}: unknown parent {node['parent']}")
        for url in node.get("lessons", []) or []:
            if url not in lessons:
                errors.append(f"{where}: no generated lesson at {url}")
        for resource in node.get("resources", []) or []:
            check_resource(resource, where)
    requires = {node.get("id"): [r for r in node.get("requires", []) or [] if r in known] for node in nodes}
    state = {}

    def visit(ident, trail):
        if state.get(ident) == "done":
            return
        if state.get(ident) == "active":
            errors.append(f"knowledge graph: prerequisite cycle {' -> '.join(trail + [ident])}")
            return
        state[ident] = "active"
        for ref in requires.get(ident, []):
            visit(ref, trail + [ident])
        state[ident] = "done"

    for ident in requires:
        visit(ident, [])


def validate(root=ROOT):
    """Return (errors, warnings) for the Hub and Academy presentation data."""
    errors, warnings = [], []
    if not (root/MIRROR).is_file() or (root/MIRROR).read_bytes() != (root/REGISTRY).read_bytes():
        errors.append(f"{MIRROR} differs from {REGISTRY}; run tools/hub_data.py --write")
    registry = {record["id"]: record for record in json.loads((root/REGISTRY).read_text(encoding="utf-8"))["capabilities"]}
    hub, academy = load_yaml(root, HUB), load_yaml(root, ACADEMY)
    paths, lessons = public_paths(root), academy_lessons(root)
    public = {c["key"] for c in hub["categories"]}
    categories = public | {"platform", "academy"}
    domains = {d["key"] for d in hub["domains"]}
    languages = ("en", "zh")

    def check_url(url, where, localised=False):
        if not resolves(url, paths):
            errors.append(f"{where}: unresolved URL {url}")
        if localised and not url.startswith("http") and not resolves("/zh"+url, paths):
            errors.append(f"{where}: no Chinese counterpart for {url}")

    def check_resource(resource, where):
        if set(resource.get("label", {})) != set(languages):
            errors.append(f"{where}: resource label needs en and zh")
        check_url(resource.get("url", ""), where, resource.get("localised", False))

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
        card = item.get("card")
        if card is not None:
            if item.get("category") not in public:
                errors.append(f"{where}: only artifacts in a Hub category can carry a card")
            if set(card.get("summary", {})) != set(languages):
                errors.append(f"{where}: card summary needs en and zh")
            if "status" in card and card["status"] not in hub["status_labels"]:
                errors.append(f"{where}: unknown card status {card['status']}")
        if "registry" in item:
            if item["registry"] not in registry:
                errors.append(f"{where}: not in {REGISTRY}")
            placed[item["registry"]] = placed.get(item["registry"], 0) + 1
            if not item.get("zh_summary"):
                errors.append(f"{where}: needs a zh_summary for Chinese pages")
        elif "academy" in item:
            if item["academy"] not in lessons:
                errors.append(f"{where}: no generated Academy lesson at this URL")
            if set(item.get("description", {})) != set(languages):
                errors.append(f"{where}: description needs en and zh")
            lesson_lang = lessons.get(item["academy"], {}).get("lang", "en")
            for language in set(languages) - {lesson_lang}:
                if not item.get("title", {}).get(language):
                    errors.append(f"{where}: {lesson_lang} lesson needs a {language} title for {language} pages")
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
    for key in sorted(public):
        if not any(item.get("card") and item.get("category") == key for item in hub["artifacts"]):
            errors.append(f"categories.{key}: needs at least one artifact with a card")
    for record in registry.values():
        integration = record["compatibility"].get("integration")
        if integration not in hub["integration_labels"]:
            errors.append(f"integration_labels: missing Registry integration {integration}")
        if record["validation"].get("status") not in hub["check_labels"]:
            errors.append(f"check_labels: missing Registry validation status {record['validation'].get('status')}")
        for tool in record.get("tools", []):
            if tool["licence_class"] not in hub["licence_class_labels"]:
                errors.append(f"licence_class_labels: missing Registry licence class {tool['licence_class']}")
        if record["type"] not in hub["type_labels"]:
            errors.append(f"type_labels: missing Registry type {record['type']}")
        if record["maturity"] not in hub["status_labels"]:
            errors.append(f"status_labels: missing Registry maturity {record['maturity']}")
    for meta in lessons.values():
        if meta["lesson_status"] not in hub["status_labels"]:
            errors.append(f"status_labels: missing Academy status {meta['lesson_status']}")

    if set(academy.get("intro", {})) != set(languages):
        errors.append("academy intro needs en and zh")
    staged = set()
    for stage in academy["stages"]:
        for field in ("title", "summary", "topics"):
            if set(stage.get(field, {})) != set(languages):
                errors.append(f"academy stage {stage['key']}: {field} needs en and zh")
        for url in stage["lessons"]:
            if url not in lessons:
                errors.append(f"academy stage {stage['key']}: no generated lesson at {url}")
            staged.add(url)
        unknown = set(stage.get("hub", [])) - domains
        if unknown:
            errors.append(f"academy stage {stage['key']}: unknown domains {sorted(unknown)}")
        if stage.get("url") != f"/academy/{stage['key']}/":
            errors.append(f"academy stage {stage['key']}: url must be /academy/{stage['key']}/")
        else:
            check_url(stage["url"], f"academy stage {stage['key']}", localised=True)
        if not re.fullmatch(r"#[0-9a-fA-F]{6}", str(stage.get("color", ""))):
            errors.append(f"academy stage {stage['key']}: color must be a #rrggbb value")
        site_ids = {item["id"] for item in hub["artifacts"] if "id" in item}
        for ident in stage.get("examples", []):
            if ident not in site_ids:
                errors.append(f"academy stage {stage['key']}: example {ident} is not placed in {HUB}")
        for resource in stage.get("resources", []):
            check_resource(resource, f"academy stage {stage['key']}")
    agent_keys = set()
    for agent in load_yaml(root, AGENTS):
        where = f"agent {agent.get('key')}"
        if agent.get("key") in agent_keys:
            errors.append(f"{where}: duplicate key")
        agent_keys.add(agent.get("key"))
        repository = str(agent.get("repository", ""))
        if not repository.startswith("https://"):
            errors.append(f"{where}: repository must be an absolute https URL")
        for field in ("summary", "prompt"):
            if set(agent.get(field, {})) != set(languages):
                errors.append(f"{where}: {field} needs en and zh")
        for language, prompt in agent.get("prompt", {}).items():
            if repository and repository not in prompt:
                errors.append(f"{where}: {language} prompt must point the coding agent to {repository}")
        if "status" in agent and agent["status"] not in hub["status_labels"]:
            errors.append(f"{where}: unknown status {agent['status']}")
        check_url(agent.get("page", ""), where, localised=True)
        install = agent.get("install")
        if install is not None:
            if not str(install.get("url", "")).startswith("https://"):
                errors.append(f"{where}: install url must be the repository's own documentation")
            if set(install.get("label", {})) != set(languages):
                errors.append(f"{where}: install label needs en and zh")
    graph = load_yaml(root, GRAPH)
    validate_graph(graph, {stage["key"] for stage in academy["stages"]}, lessons, check_resource, errors)
    # Site-owned resource overlay for generated graph topics (tools/sync_ecosystem.py merges it).
    if (root/RESOURCES).is_file():
        overlay = load_yaml(root, RESOURCES) or {}
        known = {node.get("id") for node in graph.get("nodes", [])}
        for ident, resources in overlay.items():
            if ident not in known:
                errors.append(f"{RESOURCES}: unknown topic {ident}")
            for resource in resources or []:
                check_resource(resource, f"{RESOURCES} {ident}")
    # Academic references cited by generated lessons must exist in the synced reference data.
    references = set()
    if (root/REFERENCES).is_file():
        references = {course["id"] for course in json.loads((root/REFERENCES).read_text(encoding="utf-8")).get("courses", [])}
    for url, meta in lessons.items():
        for ident in meta.get("academic_references") or []:
            if ident not in references:
                errors.append(f"academy lesson {url}: unknown academic reference {ident}")
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

"""List curated community resources for the Academy knowledge graph.

  python tools/community_curation.py            # print YAML entries to review
  python tools/community_curation.py --json     # machine-readable

Moderators mark a published contribution's link to a knowledge topic as
curated (public.curate_topic). This tool reads the public view
`curated_topic_resources` with the site's public anon key and prints entries in
the format of _data/knowledge_graph_resources.yml. An administrator reviews
them, adds the chosen ones to that file by pull request and re-runs the Academy
sync (tools/sync_ecosystem.py) so the knowledge graph shows them. Nothing is
written automatically, and the Academy's own data is never changed.

The project URL and anon key come from _config.yml (community_backend) or the
SUPABASE_URL / SUPABASE_ANON_KEY environment variables.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.parse
import urllib.request
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]


def backend():
    config = yaml.safe_load((ROOT/"_config.yml").read_text(encoding="utf-8")).get("community_backend") or {}
    url = os.environ.get("SUPABASE_URL") or config.get("supabase_url") or ""
    key = os.environ.get("SUPABASE_ANON_KEY") or config.get("supabase_anon_key") or ""
    if not url or not key:
        raise SystemExit("No Supabase project configured (community_backend in _config.yml, or SUPABASE_URL / SUPABASE_ANON_KEY)")
    return url.rstrip("/"), key


def fetch(url, key):
    query = urllib.parse.urlencode({"select": "topic_id,slug,type,title,lang,curated_at", "order": "topic_id,curated_at"})
    request = urllib.request.Request(f"{url}/rest/v1/curated_topic_resources?{query}",
                                     headers={"apikey": key, "Authorization": f"Bearer {key}"})
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def entries(rows):
    grouped = {}
    for row in rows:
        grouped.setdefault(row["topic_id"], []).append({
            "url": f"/community/contribution/?slug={row['slug']}",
            "localised": True,
            "label": {"en": f"Community: {row['title']}", "zh": f"社区：{row['title']}"},
        })
    return grouped


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    grouped = entries(fetch(*backend()))
    if args.json:
        json.dump(grouped, sys.stdout, ensure_ascii=False, indent=2)
    elif not grouped:
        print("# No curated community resources.")
    else:
        print("# Review, then merge into _data/knowledge_graph_resources.yml and re-run the Academy sync.")
        print(yaml.safe_dump(grouped, allow_unicode=True, sort_keys=True, width=120))


if __name__ == "__main__":
    main()

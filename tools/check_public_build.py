"""Verify that Jekyll publishes raw Registry endpoints, every stable lesson URL and every Exploration."""
import hashlib
import json
from html.parser import HTMLParser
from pathlib import Path
import sys

import yaml

root = Path(__file__).resolve().parents[1]
site = Path(sys.argv[1])
for name in ("aipe.json", "aipe.md"):
    if (site/name).read_bytes() != (root/name).read_bytes():
        raise SystemExit(f"Registry endpoint changed during rendering: {name}")
for source in sorted((root/"academy").glob("*.md")):
    metadata = yaml.safe_load(source.read_text(encoding="utf-8").split("---",2)[1])
    target = site / metadata["permalink"].strip("/") / "index.html"
    rendered = target.read_text(encoding="utf-8")
    if "<h1>" not in rendered or "{%" in rendered:
        raise SystemExit(f"Unrendered Academy page: {target}")
legacy = site/"resources/blog/buck-converter-from-zero-to-everything/index.html"
if not legacy.is_file():
    raise SystemExit("Migrated tutorial's legacy URL was lost")
explorations = ["/explorations/", "/zh/explorations/"]
for source in sorted((root/"_explorations").rglob("*.md")):
    explorations.append(yaml.safe_load(source.read_text(encoding="utf-8").split("---",2)[1])["permalink"])
for url in explorations:
    rendered = (site/url.strip("/")/"index.html").read_text(encoding="utf-8")
    if "<h1>" not in rendered or "{%" in rendered:
        raise SystemExit(f"Unrendered Explorations page: {url}")

class FooterLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_footer = False
        self.links = set()

    def handle_starttag(self, tag, attrs):
        if tag == "footer":
            self.in_footer = True
        if tag == "a" and self.in_footer:
            href = dict(attrs).get("href")
            if href:
                self.links.add(href)

    def handle_endtag(self, tag):
        if tag == "footer":
            self.in_footer = False


# Keep these public destinations independently reachable after navigation edits.
company_paths = ("company/about/", "company/team/", "company/careers/",
                 "company/faq/", "news/", "contact/")
for prefix in ("", "zh/"):
    expected = {"/" + prefix + path for path in company_paths}
    for path in ("",) + company_paths:
        target = site / prefix / path / "index.html"
        parser = FooterLinks()
        parser.feed(target.read_text(encoding="utf-8"))
        missing = expected - parser.links
        if missing:
            raise SystemExit(f"Company footer destinations missing from {target}: {sorted(missing)}")
print("Public endpoints, stable content URLs and bilingual Company footer destinations verified")

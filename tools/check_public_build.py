"""Verify that Jekyll publishes raw Registry endpoints, every stable lesson URL, every Frontiers topic,
the four Academy subject pages, the Academy legacy redirects, the lesson-page academic references and
the newsletter subscription and Community pages, and the Team and Careers redirects."""
import hashlib
import json
from pathlib import Path
import sys

import yaml

root = Path(__file__).resolve().parents[1]
site = Path(sys.argv[1])
for name in ("aipe.json", "aipe.md"):
    if (site/name).read_bytes() != (root/name).read_bytes():
        raise SystemExit(f"Registry endpoint changed during rendering: {name}")
references = {c["id"] for c in json.loads((root/"_data/academic_references.json").read_text(encoding="utf-8"))["courses"]} if (root/"_data/academic_references.json").is_file() else set()
for source in sorted((root/"academy").glob("*.md")):
    metadata = yaml.safe_load(source.read_text(encoding="utf-8").split("---",2)[1])
    target = site / metadata["permalink"].strip("/") / "index.html"
    rendered = target.read_text(encoding="utf-8")
    if "<h1>" not in rendered or "{%" in rendered:
        raise SystemExit(f"Unrendered Academy page: {target}")
    if metadata.get("lesson_status"):
        if metadata.get("canonical_source_url") and metadata["canonical_source_url"] not in rendered:
            raise SystemExit(f"Lesson page lacks its canonical GitHub source link: {target}")
        cited = metadata.get("academic_references") or []
        if cited:
            if "academy-academic-references" not in rendered or "not affiliated with or endorsed by MIT" not in rendered and "与 MIT 没有隶属关系" not in rendered:
                raise SystemExit(f"Lesson page lacks the external academic references panel: {target}")
            for ident in cited:
                if ident not in references:
                    raise SystemExit(f"Lesson cites unknown academic reference {ident}: {target}")
legacy = site/"resources/blog/buck-converter-from-zero-to-everything/index.html"
if not legacy.is_file():
    raise SystemExit("Migrated tutorial's legacy URL was lost")
academy = yaml.safe_load((root/"_data/academy.yml").read_text(encoding="utf-8"))
for stage in academy["stages"]:
    for prefix in ("", "/zh"):
        page = site / (prefix + stage["url"]).strip("/") / "index.html"
        if not page.is_file() or "<h1>" not in page.read_text(encoding="utf-8"):
            raise SystemExit(f"Academy subject page missing: {prefix}{stage['url']}")
for old, new in (("/academy/renewables/", "/academy/renewable-energy/"), ("/zh/academy/renewables/", "/zh/academy/renewable-energy/")):
    redirect = site/old.strip("/")/"index.html"
    if not redirect.is_file() or f'url={new}"' not in redirect.read_text(encoding="utf-8"):
        raise SystemExit(f"Former Academy subject URL does not redirect: {old} -> {new}")
frontiers = ["/frontiers/", "/zh/frontiers/"]
for source in sorted((root/"_explorations").rglob("*.md")):
    frontiers.append(yaml.safe_load(source.read_text(encoding="utf-8").split("---",2)[1])["permalink"])
for url in frontiers:
    rendered = (site/url.strip("/")/"index.html").read_text(encoding="utf-8")
    if "<h1>" not in rendered or "{%" in rendered:
        raise SystemExit(f"Unrendered Frontiers page: {url}")
    # Frontiers was published as Explorations; every former URL must redirect.
    old = url.replace("/frontiers/", "/explorations/", 1)
    redirect = site/old.strip("/")/"index.html"
    if not redirect.is_file() or f'url={url}"' not in redirect.read_text(encoding="utf-8"):
        raise SystemExit(f"Former Explorations URL does not redirect: {old} -> {url}")
for url in ("/subscribe/", "/zh/subscribe/"):
    rendered = (site/url.strip("/")/"index.html").read_text(encoding="utf-8")
    if 'id="newsletter-form"' not in rendered or "{%" in rendered or 'name="consent"' not in rendered:
        raise SystemExit(f"Subscription page incomplete: {url}")
for page in (site/"index.html", site/"zh/index.html"):
    if "/subscribe/" not in page.read_text(encoding="utf-8").split('class="footer"', 1)[1]:
        raise SystemExit(f"Footer lacks the Subscribe link: {page}")
for prefix in ("", "/zh"):
    for slug in ("", "explore/", "contribution/", "members/", "join/", "account/", "submit/", "moderation/", "guidelines/"):
        url = f"{prefix}/community/{slug}"
        rendered = (site/url.strip("/")/"index.html").read_text(encoding="utf-8")
        if "<h1>" not in rendered or "{%" in rendered:
            raise SystemExit(f"Community page incomplete: {url}")
        if slug not in ("", "guidelines/") and ('id="community-app"' not in rendered or 'id="community-config"' not in rendered):
            raise SystemExit(f"Community page lacks the application mount: {url}")
# Team and Careers are unpublished: no links to them, their URLs redirect and the sitemap omits them.
sitemap = (site/"sitemap.xml").read_text(encoding="utf-8")
site_url = yaml.safe_load((root/"_config.yml").read_text(encoding="utf-8"))["url"]
for prefix, about, contact in (("", "/company/about/", "/contact/"), ("/zh", "/zh/company/about/", "/zh/contact/")):
    for page, target in (("team", about), ("careers", contact)):
        url = f"{prefix}/company/{page}/"
        redirect = (site/url.strip("/")/"index.html").read_text(encoding="utf-8")
        if f'url={target}"' not in redirect:
            raise SystemExit(f"Former Company page does not redirect: {url} -> {target}")
        for linking in (site/prefix.strip("/")/"index.html", site/about.strip("/")/"index.html"):
            if f'href="{url}"' in linking.read_text(encoding="utf-8"):
                raise SystemExit(f"{linking} still links the unpublished {url}")
        if f"<loc>{site_url}{url}</loc>" in sitemap:
            raise SystemExit(f"Sitemap lists the unpublished {url}")
# Markdown endpoints without front matter stay raw files; their former page URLs redirect to them.
for url, target in (("/aipe/", "/aipe.md"), ("/legacy/aipe-resource-index-v0/", "/legacy/aipe-resource-index-v0.md")):
    if not (site/target.strip("/")).is_file():
        raise SystemExit(f"Raw Markdown endpoint missing: {target}")
    if f'url={target}"' not in (site/url.strip("/")/"index.html").read_text(encoding="utf-8"):
        raise SystemExit(f"{url} does not redirect to the raw endpoint {target}")
print("Public Registry endpoints, Academy URLs, subject pages, academic references, legacy redirects, Frontiers URLs, subscription and Community pages, Company redirects verified")

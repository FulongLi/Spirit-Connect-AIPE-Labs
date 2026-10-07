"""Verify that internal links in the built site resolve to published files.

  python tools/check_site_links.py _site

Checks every href/src that points inside the site (root-relative or relative),
ignoring external URLs, mailto:, data: and in-page fragments. A link resolves
when the built site contains the file, or a directory with an index.html.
"""
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
import sys

SKIP_SCHEMES = ("http:", "https:", "mailto:", "tel:", "data:", "javascript:")


class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in {"href", "src"} and value:
                self.links.append(value)


def page_url(site, path):
    relative = path.relative_to(site).as_posix()
    if relative.endswith("index.html"):
        return "/" + relative[: -len("index.html")]
    return "/" + relative


def resolves(site, target):
    path = unquote(urlsplit(target).path)
    candidate = site / path.lstrip("/")
    if path.endswith("/"):
        return (candidate / "index.html").is_file()
    return candidate.is_file() or (candidate / "index.html").is_file()


def check(site):
    broken = []
    for html in sorted(site.rglob("*.html")):
        parser = LinkParser()
        parser.feed(html.read_text(encoding="utf-8", errors="replace"))
        base = page_url(site, html)
        for link in parser.links:
            if link.startswith(SKIP_SCHEMES) or link.startswith(("#", "//")):
                continue
            target = urljoin(base, link)
            if not resolves(site, target):
                broken.append((base, link))
    return broken


def main():
    site = Path(sys.argv[1] if len(sys.argv) > 1 else "_site")
    broken = check(site)
    for page, link in broken:
        print(f"{page}: {link}")
    if broken:
        raise SystemExit(f"{len(broken)} broken internal link(s)")
    print("All internal links resolve")


if __name__ == "__main__":
    main()

"""Static checks for the Company section: Team and Careers are withdrawn but kept for restoration."""
from __future__ import annotations

import unittest
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
WITHDRAWN = {
    "/company/team/": "/company/about/",
    "/company/careers/": "/contact/",
    "/zh/company/team/": "/zh/company/about/",
    "/zh/company/careers/": "/zh/contact/",
}


def front_matter(path):
    return yaml.safe_load(path.read_text(encoding="utf-8").split("---", 2)[1]) or {}


class WithdrawnCompanyPages(unittest.TestCase):
    def test_sources_are_kept_but_unpublished(self):
        for url in WITHDRAWN:
            source = ROOT / url.strip("/").replace("/team", "/team.md").replace("/careers", "/careers.md")
            metadata = front_matter(source)
            self.assertEqual(metadata["permalink"], url)
            self.assertIs(metadata.get("published"), False, source)

    def test_former_urls_redirect_and_stay_out_of_the_sitemap(self):
        redirects = {}
        for path in (ROOT / "legacy").glob("*.md"):
            if not path.read_text(encoding="utf-8").startswith("---"):
                continue
            metadata = front_matter(path)
            redirects[metadata["permalink"]] = metadata
        for url, target in WITHDRAWN.items():
            self.assertEqual(redirects[url]["redirect_to"], target)
            self.assertEqual(redirects[url]["layout"], "redirect")
            self.assertIs(redirects[url]["sitemap"], False)

    def test_no_public_template_links_the_withdrawn_pages(self):
        for path in [*(ROOT / "_includes").glob("*.html"), *(ROOT / "_layouts").glob("*.html")]:
            if path.name == "team.html":
                continue
            text = path.read_text(encoding="utf-8")
            self.assertNotIn("/company/team/", text, path)
            self.assertNotIn("/company/careers/", text, path)

    def test_company_column_keeps_the_other_pages(self):
        footer = (ROOT / "_includes/footer.html").read_text(encoding="utf-8")
        company = footer.split("t.footer_company", 1)[1].split("</p>", 1)[0]
        for path in ("/company/about/", "/company/faq/", "/news/", "/subscribe/", "/contact/"):
            self.assertIn(f"'{path}'", company)


if __name__ == "__main__":
    unittest.main()

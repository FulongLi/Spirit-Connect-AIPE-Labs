"""Static checks for the site's information architecture: Academia | Industry | Plugin | Support AIPE.

Academia gathers Research (AIPE Frontiers, /frontiers/) and Education (AIPE Academy, /academy/).
Industry is the public name of the Hub; its /hub/ URLs, categories and Registry data are unchanged.
"""
from __future__ import annotations

import re
import unittest
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
LABELS = {
    "nav_academia": ("Academia", "学术"),
    "nav_research": ("Research", "研究"),
    "nav_education": ("Education", "教育"),
    "nav_hub": ("Industry", "产业"),
    "nav_plugin": ("Plugin", "插件"),
    "nav_support": ("Support AIPE", "支持 AIPE"),
}


def front_matter(path):
    return yaml.safe_load(path.read_text(encoding="utf-8").split("---", 2)[1]) or {}


def menu(source):
    """The main menu of the navbar: the HTML between <nav id="mainmenu"> and its closing tag."""
    return source.split('<nav id="mainmenu" class="menu">', 1)[1].split("</nav>", 1)[0]


class MainNavigation(unittest.TestCase):
    def setUp(self):
        self.menu = menu((ROOT / "_includes/navbar.html").read_text(encoding="utf-8"))
        self.i18n = yaml.safe_load((ROOT / "_data/i18n.yml").read_text(encoding="utf-8"))

    def test_bilingual_labels(self):
        for key, (en, zh) in LABELS.items():
            self.assertEqual((self.i18n["en"][key], self.i18n["zh"][key]), (en, zh), key)

    def test_top_level_order(self):
        labels = re.findall(r'class="(?:drop-label|nav-direct)" href="[^"]*">\{\{ t\.(\w+) \}\}', self.menu)
        self.assertEqual(labels, ["nav_academia", "nav_hub", "nav_plugin", "nav_support"])

    def test_academia_dropdown_leads_to_research_and_education(self):
        academia = self.menu.split("t.nav_academia", 1)[1].split('<div class="dropdown">', 1)[0]
        self.assertIn("'/academia/'", self.menu)
        self.assertEqual(re.findall(r"append: '([^']+)' \| relative_url \}\}\">\{\{ t\.(\w+)", academia),
                         [("/frontiers/", "nav_research"), ("/academy/", "nav_education")])

    def test_industry_dropdown_keeps_the_three_hub_categories(self):
        hub = yaml.safe_load((ROOT / "_data/hub.yml").read_text(encoding="utf-8"))
        self.assertEqual([c["url"] for c in hub["categories"]], ["/hub/data/", "/hub/tools/", "/hub/workflows/"])
        industry = self.menu.split("t.nav_hub", 1)[1]
        self.assertIn("for category in site.data.hub.categories", industry)

    def test_frontiers_and_blog_are_no_longer_top_level(self):
        self.assertNotIn("t.nav_explorations", self.menu)
        self.assertNotIn("/resources/blog/", self.menu)

    def test_language_selector_and_contact_button_are_kept(self):
        navbar = (ROOT / "_includes/navbar.html").read_text(encoding="utf-8")
        self.assertIn('class="dropdown lang-switch"', navbar)
        self.assertIn('class="cta desktop-cta"', navbar)


class AcademiaLanding(unittest.TestCase):
    def test_pages_exist_in_both_languages(self):
        for path, url, lang in (("academia.md", "/academia/", "en"), ("zh/academia.md", "/zh/academia/", "zh")):
            metadata = front_matter(ROOT / path)
            self.assertEqual((metadata["layout"], metadata["permalink"], metadata["lang"]), ("academia", url, lang))

    def test_cards_link_existing_sections_and_the_article_library(self):
        layout = (ROOT / "_layouts/academia.html").read_text(encoding="utf-8")
        for target in ("'/frontiers/'", "'/academy/'", "'/resources/blog/'"):
            self.assertIn(target, layout)
        self.assertNotIn("knowledge-graph", layout)

    def test_copy_is_bilingual(self):
        data = yaml.safe_load((ROOT / "_data/presentation.yml").read_text(encoding="utf-8"))["academia"]

        def walk(node, path="academia"):
            if isinstance(node, dict) and set(node) == {"en", "zh"}:
                self.assertTrue(node["en"] and node["zh"], path)
            elif isinstance(node, dict):
                for key, value in node.items():
                    walk(value, f"{path}.{key}")
        walk(data)


class Footer(unittest.TestCase):
    def test_academia_and_industry_columns(self):
        footer = (ROOT / "_includes/footer.html").read_text(encoding="utf-8")
        academia = footer.split("t.footer_learn", 1)[1].split("</div>", 1)[0]
        for target in ("'/academia/'", "'/frontiers/'", "'/academy/'", "'/resources/blog/'"):
            self.assertIn(target, academia)
        industry = footer.split("t.footer_hub", 1)[1].split("</div>", 1)[0]
        self.assertIn("site.data.hub.categories", industry)
        self.assertIn("'/plugin/'", industry)
        i18n = yaml.safe_load((ROOT / "_data/i18n.yml").read_text(encoding="utf-8"))
        self.assertEqual((i18n["en"]["footer_learn"], i18n["en"]["footer_hub"]), ("Academia", "Industry"))
        self.assertEqual((i18n["zh"]["footer_learn"], i18n["zh"]["footer_hub"]), ("学术", "产业"))


class HubUrlsAreKept(unittest.TestCase):
    def test_hub_pages_keep_their_urls(self):
        for prefix in ("", "zh/"):
            for name, url in (("index", "/hub/"), ("data", "/hub/data/"), ("tools", "/hub/tools/"), ("workflows", "/hub/workflows/")):
                metadata = front_matter(ROOT / f"{prefix}hub/{name}.md")
                self.assertEqual(metadata["permalink"], ("/zh" if prefix else "") + url)


if __name__ == "__main__":
    unittest.main()

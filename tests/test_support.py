"""Static checks for Support AIPE (/support/, /zh/support/).

Financial support stays a placeholder until an official Buy Me a Coffee URL is configured, the site
never processes payments, the Shop is only announced, and AIPE is never presented as a charity.
"""
from __future__ import annotations

import re
import unittest
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
DATA = yaml.safe_load((ROOT / "_data/support.yml").read_text(encoding="utf-8"))
LAYOUT = (ROOT / "_layouts/support.html").read_text(encoding="utf-8")


def front_matter(path):
    return yaml.safe_load(path.read_text(encoding="utf-8").split("---", 2)[1]) or {}


def bilingual(node, path="support"):
    if isinstance(node, dict) and set(node) == {"en", "zh"}:
        yield path, node
    elif isinstance(node, dict):
        for key, value in node.items():
            yield from bilingual(value, f"{path}.{key}")
    elif isinstance(node, list):
        for index, value in enumerate(node):
            yield from bilingual(value, f"{path}[{index}]")


class SupportPages(unittest.TestCase):
    def test_pages_exist_in_both_languages(self):
        for path, url, lang, title in (("support.md", "/support/", "en", "Support AIPE"),
                                       ("zh/support.md", "/zh/support/", "zh", "支持 AIPE")):
            metadata = front_matter(ROOT / path)
            self.assertEqual((metadata["layout"], metadata["permalink"], metadata["lang"], metadata["title"]),
                             ("support", url, lang, title))

    def test_three_areas(self):
        self.assertEqual(re.findall(r'<article class="support-card" id="(\w+)"', LAYOUT), ["development", "contribute", "shop"])
        self.assertEqual(DATA["title"], {"en": "Support AIPE", "zh": "支持 AIPE"})

    def test_every_string_is_bilingual(self):
        pairs = list(bilingual(DATA))
        self.assertGreater(len(pairs), 15)
        for path, node in pairs:
            self.assertTrue(str(node["en"]).strip() and str(node["zh"]).strip(), path)


class FinancialSupport(unittest.TestCase):
    def test_payment_link_is_unset_or_an_official_buy_me_a_coffee_page(self):
        url = DATA["buy_me_a_coffee_url"]
        self.assertTrue(url == "" or re.fullmatch(r"https://(www\.)?buymeacoffee\.com/[A-Za-z0-9_-]+/?", url), url)

    def test_button_only_renders_when_configured(self):
        self.assertIn("{%- if coffee == '' %}", LAYOUT)
        button = LAYOUT.split("{%- else %}", 1)[1].split("{%- endif %}", 1)[0]
        self.assertIn('href="{{ coffee }}"', button)
        self.assertEqual(LAYOUT.count('href="{{ coffee }}"'), 1)

    def test_no_payment_processing(self):
        for marker in ("<form", "<input", "checkout", "stripe", "paypal", "cart"):
            self.assertNotIn(marker, LAYOUT.lower())

    def test_never_claims_charity_status(self):
        for path, node in bilingual(DATA):
            text = node["en"].lower()
            if "charit" in text or "tax" in text:
                self.assertIn("not", text, path)
        self.assertIn("not a registered charity", DATA["development"]["note"]["en"])
        self.assertIn("not tax-deductible", DATA["development"]["note"]["en"])


class Contribution(unittest.TestCase):
    def test_links_are_public_github_entry_points(self):
        urls = [link["url"] for link in DATA["contribute"]["links"]]
        self.assertEqual(urls, ["https://github.com/FulongLi/Spirit-Connect-AIPE-Labs",
                                "https://github.com/FulongLi/Spirit-Connect-AIPE-Labs/issues",
                                "https://github.com/AIPE-Labs"])
        explorations = yaml.safe_load((ROOT / "_data/explorations.yml").read_text(encoding="utf-8"))
        self.assertEqual(urls[0], explorations["repository"])


class Shop(unittest.TestCase):
    def test_shop_is_only_announced(self):
        shop = LAYOUT.split('id="shop"', 1)[1].split("</article>", 1)[0]
        self.assertIn("sp.coming_soon[lang]", shop)
        self.assertNotIn("<a ", shop)
        for item in ("T-shirts", "mugs", "pens"):
            self.assertIn(item, DATA["shop"]["text"]["en"])


class Discoverability(unittest.TestCase):
    def test_nav_and_footer_link_support(self):
        navbar = (ROOT / "_includes/navbar.html").read_text(encoding="utf-8")
        self.assertIn("append: '/support/' | relative_url }}\">{{ t.nav_support }}", navbar)
        footer = (ROOT / "_includes/footer.html").read_text(encoding="utf-8")
        self.assertIn("'/support/'", footer.split("t.footer_company", 1)[1].split("</div>", 1)[0])


if __name__ == "__main__":
    unittest.main()

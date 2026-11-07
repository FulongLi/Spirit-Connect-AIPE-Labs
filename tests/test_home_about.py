"""Static checks for the homepage and About page: Partners & Collaborations live on About only."""
from __future__ import annotations

import re
import unittest
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
HOMEPAGES = (ROOT / "index.md", ROOT / "zh/index.md")


class Homepage(unittest.TestCase):
    def test_collaboration_sections_are_removed(self):
        for page in HOMEPAGES:
            text = page.read_text(encoding="utf-8")
            for marker in ("partners-marquee", "collaboration-section", "partners-section"):
                self.assertNotIn(marker, text, page)

    def test_sections_are_kept_and_the_page_ends_after_the_design_loop(self):
        for page in HOMEPAGES:
            text = page.read_text(encoding="utf-8")
            sections = re.findall(r'<(?:header|section) class="([^"]+)"', text)
            self.assertEqual(sections, ["home-hub-hero", "section home-pillars-section",
                                        "section section-alt home-plugin", "section home-loop"], page)
            self.assertIn("hub-search.html", text)
            self.assertTrue(text.rstrip().endswith("</section>"))
            self.assertEqual(text.rsplit('<section class="section home-loop">', 1)[1].count("<section"), 0)

    def test_pillars_lead_to_education_industry_and_research(self):
        for page, lp in zip(HOMEPAGES, ("", "/zh")):
            pillars = page.read_text(encoding="utf-8").split('<ol class="home-pillars"', 1)[1].split("</ol>", 1)[0]
            self.assertEqual(re.findall(r'<span class="home-pillar-verb">(\w+)', pillars), ["LEARN", "BUILD", "EXPLORE"])
            self.assertEqual(re.findall(r"class=\"btn btn-primary\" href=\"\{\{ '([^']+)'", pillars),
                             [f"{lp}/academy/", f"{lp}/hub/", f"{lp}/frontiers/"])


class AboutPage(unittest.TestCase):
    def setUp(self):
        self.layout = (ROOT / "_layouts/about.html").read_text(encoding="utf-8")
        self.about = yaml.safe_load((ROOT / "_data/presentation.yml").read_text(encoding="utf-8"))["about"]

    def test_section_order(self):
        order = [self.layout.index(marker) for marker in (
            "about.title[lang]", 'id="why-i-built-aipe"', "about-mission", "about-loop", 'id="partners"', "home-invitation")]
        self.assertEqual(order, sorted(order))

    def test_partners_section_reuses_the_marquee_and_links_contact(self):
        partners = self.layout.split('id="partners"', 1)[1].split("</section>", 1)[0]
        self.assertEqual(self.layout.count("{% include partners-marquee.html %}"), 1)
        self.assertIn("{% include partners-marquee.html %}", partners)
        self.assertIn("'/contact/'", partners)
        self.assertIn("https://github.com/AIPE-Labs", partners)
        card = partners.split('<div class="about-partners-logos">', 1)[1]
        self.assertIn("about.partners_logos_title[lang]", card)
        self.assertIn("{% include partners-marquee.html %}", card)
        self.assertLess(partners.index("about.collaborate_invite"), partners.index("about-partners-logos"))

    def test_partner_data_is_unchanged_and_every_logo_exists(self):
        partners = yaml.safe_load((ROOT / "_data/partners.yml").read_text(encoding="utf-8"))
        self.assertEqual(len(partners), 8)
        for partner in partners:
            self.assertTrue((ROOT / "images/general" / partner["image"]).is_file(), partner["image"])
            self.assertTrue(partner["alt_en"] and partner["alt_zh"])

    def test_copy_is_bilingual(self):
        keys = ["partners_kicker", "partners_title", "partners_intro", "collaborate_invite", "collaborate_action",
                "collaborate_github", "partners_logos_title", "partners_logos_intro", "contact_title", "contact_intro", "contact_action"]
        for key in keys:
            self.assertTrue(self.about[key]["en"] and self.about[key]["zh"], key)
        self.assertEqual(len(self.about["collaborators"]), 3)
        for group in self.about["collaborators"]:
            for field in ("title", "text"):
                self.assertTrue(group[field]["en"] and group[field]["zh"])

    def test_collaboration_invitation_appears_once(self):
        invitation = self.about["collaborate_invite"]["en"]
        self.assertNotIn("collaborat", self.about["contact_intro"]["en"].lower())
        self.assertNotIn("collaborat", self.about["contact_title"]["en"].lower())
        self.assertEqual(self.layout.count("about.collaborate_invite"), 1)
        self.assertTrue(invitation)


if __name__ == "__main__":
    unittest.main()

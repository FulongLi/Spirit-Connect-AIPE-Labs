"""Static checks for the newsletter and AIPE Community presentation layer.

The backend (supabase/) is tested by `npm test`; these tests cover the Jekyll
sources: bilingual page parity, footer navigation, translation keys and the
rule that no secret is ever committed to the public site configuration.
"""
from __future__ import annotations

import re
import unittest
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]


def front_matter(path):
    text = path.read_text(encoding="utf-8")
    return yaml.safe_load(text.split("---", 2)[1]) or {}


class NewsletterPages(unittest.TestCase):
    def test_subscribe_pages_exist_in_both_languages(self):
        en = front_matter(ROOT / "subscribe.md")
        zh = front_matter(ROOT / "zh/subscribe.md")
        self.assertEqual((en["permalink"], en["lang"], en["layout"]), ("/subscribe/", "en", "subscribe"))
        self.assertEqual((zh["permalink"], zh["lang"], zh["layout"]), ("/zh/subscribe/", "zh", "subscribe"))

    def test_footer_company_column_links_subscribe(self):
        footer = (ROOT / "_includes/footer.html").read_text(encoding="utf-8")
        company = footer.split("t.footer_company", 1)[1].split("</div>", 1)[0]
        self.assertIn("'/subscribe/'", company)
        self.assertIn("t.footer_subscribe", company)

    def test_form_never_claims_success_without_a_backend(self):
        layout = (ROOT / "_layouts/subscribe.html").read_text(encoding="utf-8")
        script = (ROOT / "assets/newsletter.js").read_text(encoding="utf-8")
        self.assertIn("{% if endpoint == '' %} disabled{% endif %}", layout)
        self.assertIn("t.newsletter_unconfigured", layout)
        self.assertIn("if (!form || !form.dataset.endpoint) return;", script)
        self.assertIn("response.ok && data.ok", script)


class Translations(unittest.TestCase):
    def test_english_and_chinese_share_every_key(self):
        data = yaml.safe_load((ROOT / "_data/i18n.yml").read_text(encoding="utf-8"))
        self.assertEqual(set(data["en"]) - set(data["zh"]), set())
        self.assertEqual(set(data["zh"]) - set(data["en"]), set())
        self.assertEqual(len(data["en"]["newsletter_sections"]), len(data["zh"]["newsletter_sections"]))


class Secrets(unittest.TestCase):
    PATTERNS = (
        re.compile(r"service_role", re.I),
        re.compile(r"sb_secret_[A-Za-z0-9]"),
        re.compile(r"eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}"),  # JWT
    )

    def test_site_configuration_holds_only_public_values(self):
        config = yaml.safe_load((ROOT / "_config.yml").read_text(encoding="utf-8"))
        backend = config["community_backend"]
        self.assertEqual(set(backend), {"supabase_url", "supabase_anon_key", "turnstile_site_key"})
        text = (ROOT / "_config.yml").read_text(encoding="utf-8")
        for pattern in self.PATTERNS[1:]:
            self.assertIsNone(pattern.search(text))

    def test_env_example_has_names_only(self):
        for line in (ROOT / ".env.example").read_text(encoding="utf-8").splitlines():
            if line.strip() and not line.startswith("#"):
                name, _, value = line.partition("=")
                self.assertRegex(name, r"^[A-Z][A-Z0-9_]+$")
                self.assertEqual(value.strip(), "", f"{name} must not carry a value")

    def test_no_secret_in_frontend_or_backend_sources(self):
        sources = [*ROOT.glob("assets/**/*.js"), *ROOT.glob("_layouts/*.html"), *ROOT.glob("_includes/*.html"),
                   *ROOT.glob("supabase/**/*.ts"), *ROOT.glob("supabase/**/*.sql"), *ROOT.glob("supabase/*.toml")]
        for path in sources:
            if "/vendor/" in path.as_posix():
                continue
            text = path.read_text(encoding="utf-8")
            for pattern in self.PATTERNS[1:]:
                self.assertIsNone(pattern.search(text), f"possible secret in {path}")
        for path in [*ROOT.glob("assets/**/*.js"), *ROOT.glob("_layouts/*.html")]:
            if "/vendor/" not in path.as_posix():
                self.assertIsNone(self.PATTERNS[0].search(path.read_text(encoding="utf-8")),
                                  f"frontend code must not reference the service role: {path}")


if __name__ == "__main__":
    unittest.main()

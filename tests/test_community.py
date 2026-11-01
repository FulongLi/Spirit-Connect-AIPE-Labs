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


VIEWS = {"explore": "explore", "contribution": "contribution", "members": "member", "join": "join",
         "account": "account", "submit": "submit", "moderation": "moderation"}


def nested_keys(data, prefix=""):
    keys = set()
    for key, value in data.items():
        keys.add(prefix + key)
        if isinstance(value, dict):
            keys |= nested_keys(value, f"{prefix}{key}.")
    return keys


class CommunityPages(unittest.TestCase):
    def test_every_view_exists_in_both_languages(self):
        for slug, view in VIEWS.items():
            for prefix, folder, lang in (("", "community", "en"), ("/zh", "zh/community", "zh")):
                meta = front_matter(ROOT / folder / f"{slug}.md")
                self.assertEqual(meta["permalink"], f"{prefix}/community/{slug}/")
                self.assertEqual((meta["layout"], meta["community_view"], meta["lang"]), ("community", view, lang))
        for prefix, folder in (("", "community"), ("/zh", "zh/community")):
            self.assertEqual(front_matter(ROOT / folder / "index.md")["permalink"], f"{prefix}/community/")
            self.assertEqual(front_matter(ROOT / folder / "guidelines.md")["permalink"], f"{prefix}/community/guidelines/")

    def test_views_are_handled_by_the_client(self):
        app = (ROOT / "assets/community/app.js").read_text(encoding="utf-8")
        for view in set(VIEWS.values()):
            self.assertRegex(app, rf"\b{view}: view[A-Z]")

    def test_strings_match_across_languages_and_cover_the_client(self):
        data = yaml.safe_load((ROOT / "_data/community.yml").read_text(encoding="utf-8"))
        self.assertEqual(nested_keys(data["en"]), nested_keys(data["zh"]))
        app = "".join((ROOT / f"assets/community/{name}.js").read_text(encoding="utf-8") for name in ("app", "interaction"))
        for key in set(re.findall(r"\bT\.([a-z_]+)", app)):
            self.assertIn(key, data["en"], f"T.{key} is used but not defined")

    def test_vocabularies_match_the_database(self):
        data = yaml.safe_load((ROOT / "_data/community.yml").read_text(encoding="utf-8"))["en"]
        sql = (ROOT / "supabase/migrations/20261101000200_community_core.sql").read_text(encoding="utf-8")
        hub = yaml.safe_load((ROOT / "_data/hub.yml").read_text(encoding="utf-8"))
        domains = [d["key"] for d in hub["domains"]] + ["cross-domain"]
        self.assertEqual(list(data["domain_labels"]), domains)
        self.assertIn("array[" + ", ".join(f"'{d}'" for d in domains) + "]", sql)
        for vocab in ("tool_kinds", "dev_statuses", "evidence_levels"):
            for key in data[vocab]:
                self.assertIn(f"'{key}'", sql, f"{vocab}.{key}")
        for status in data["statuses"]:
            self.assertIn(f"'{status}'", sql)

    def test_navigation_links_the_community(self):
        self.assertIn("'/community/'", (ROOT / "_includes/navbar.html").read_text(encoding="utf-8"))
        self.assertIn("'/community/'", (ROOT / "_includes/footer.html").read_text(encoding="utf-8"))

    def test_password_auth_calls_pass_the_bot_protection_token(self):
        # Supabase requires a captcha token on all three calls once bot protection is enabled.
        app = (ROOT / "assets/community/app.js").read_text(encoding="utf-8")
        for call in ("signInWithPassword(", "signUp(", "resetPasswordForEmail("):
            start = app.index(call)
            self.assertIn("captchaToken", app[start:start + 400], call)
        self.assertNotIn("turnstileSiteKey && mode !==", app)

    def test_layout_passes_only_public_configuration(self):
        layout = (ROOT / "_layouts/community.html").read_text(encoding="utf-8")
        self.assertEqual(set(re.findall(r"backend\.([a-z_]+)", layout)), {"supabase_url", "supabase_anon_key", "turnstile_site_key"})
        self.assertNotIn("cdn.", layout, "community libraries are vendored, not loaded from a CDN")


class KnowledgeTopics(unittest.TestCase):
    def test_topic_list_matches_the_academy_graph(self):
        import importlib.util
        spec = importlib.util.spec_from_file_location("community_topics", ROOT / "tools/community_topics.py")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        self.assertEqual((ROOT / "supabase/knowledge_topics.sql").read_text(encoding="utf-8"), module.render())

    def test_curation_entries_fit_the_resource_overlay(self):
        import importlib.util
        spec = importlib.util.spec_from_file_location("community_curation", ROOT / "tools/community_curation.py")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        grouped = module.entries([{"topic_id": "pe.control", "slug": "dab-1a2b3c", "type": "article", "title": "DAB", "lang": "en"}])
        entry = grouped["pe.control"][0]
        self.assertEqual(entry["url"], "/community/contribution/?slug=dab-1a2b3c")
        self.assertEqual(set(entry["label"]), {"en", "zh"})
        self.assertTrue(entry["localised"])

    def test_community_tools_never_write_academy_data(self):
        curation = (ROOT / "tools/community_curation.py").read_text(encoding="utf-8")
        self.assertNotIn("write_text", curation)
        self.assertNotRegex(curation, r"(?<![a-z])open\(")
        topics = (ROOT / "tools/community_topics.py").read_text(encoding="utf-8")
        self.assertIn('OUTPUT = "supabase/knowledge_topics.sql"', topics)
        self.assertEqual(topics.count("write_text"), 1)


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
            if "/assets/libs/" in path.as_posix():
                continue
            text = path.read_text(encoding="utf-8")
            for pattern in self.PATTERNS[1:]:
                self.assertIsNone(pattern.search(text), f"possible secret in {path}")
        for path in [*ROOT.glob("assets/**/*.js"), *ROOT.glob("_layouts/*.html")]:
            if "/assets/libs/" not in path.as_posix():
                self.assertIsNone(self.PATTERNS[0].search(path.read_text(encoding="utf-8")),
                                  f"frontend code must not reference the service role: {path}")


if __name__ == "__main__":
    unittest.main()

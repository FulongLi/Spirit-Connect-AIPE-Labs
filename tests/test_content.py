import datetime
import importlib.util
import json
from pathlib import Path
import shutil
import tempfile
import unittest

import yaml

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("content_data", ROOT/"tools/content_data.py")
content_data = importlib.util.module_from_spec(spec)
spec.loader.exec_module(content_data)

SKIP_DIRS = {"_site", "vendor", ".git", ".jekyll-cache", ".bundle", "images", "videos", "accessories",
             "tools", "tests", "_includes", "_layouts", "assets", ".ecosystem-sources", ".claude", "node_modules"}
SKIP_SUFFIXES = {".png", ".jpg", ".jpeg", ".webp", ".mp4", ".svg", ".pdf", ".gif"}
ENTRY = "_explorations/autonomous-dc-network-stability.md"
ENTRY_ZH = "_explorations/zh/autonomous-dc-network-stability.md"
TODAY = datetime.date(2026, 10, 8)


def ignore(folder, names):
    return [n for n in names if n in SKIP_DIRS or Path(n).suffix.lower() in SKIP_SUFFIXES]


class ContentDataTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pristine = tempfile.TemporaryDirectory()
        cls.base = Path(cls.pristine.name)/"site"
        shutil.copytree(ROOT, cls.base, ignore=ignore)

    @classmethod
    def tearDownClass(cls):
        cls.pristine.cleanup()

    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)/"site"
        shutil.copytree(self.base, self.root)

    def tearDown(self):
        self.temp.cleanup()

    def edit_entry(self, relative, change, body=None):
        path = self.root/relative
        meta, text = content_data.split_front_matter(path)
        change(meta)
        if body:
            text = body(text)
        path.write_text("---\n" + yaml.safe_dump(meta, allow_unicode=True, sort_keys=False) + "---" + text, encoding="utf-8")

    def errors(self):
        return "\n".join(content_data.validate(self.root))

    def test_repository_content_is_valid(self):
        self.assertEqual(content_data.validate(ROOT), [])

    def test_status_needs_its_evidence(self):
        self.edit_entry(ENTRY, lambda m: m.update(status="simulated"))
        self.assertIn("status simulated needs recorded simulation evidence", self.errors())

    def test_refuted_needs_some_evidence(self):
        self.edit_entry(ENTRY, lambda m: m.update(status="refuted"))
        self.assertIn("status refuted needs one of", self.errors())

    def test_reproducible_evidence_must_link_its_files(self):
        item = {"kind": "simulation", "summary": "Eigenvalue sweep", "date": TODAY}
        self.edit_entry(ENTRY, lambda m: m.update(status="simulated", evidence=[item]))
        self.assertIn("simulation evidence must link to its files or data", self.errors())

    def test_human_review_names_the_reviewer(self):
        item = {"kind": "human-review", "summary": "Checked the derivation", "date": TODAY}
        self.edit_entry(ENTRY, lambda m: m.update(status="human-reviewed", evidence=[item]))
        self.assertIn("human-review evidence must name the reviewer", self.errors())

    def test_supported_status_passes_when_translations_agree(self):
        item = {"kind": "literature", "summary": "Mapped prior impedance criteria", "date": TODAY}
        for relative in (ENTRY, ENTRY_ZH):
            self.edit_entry(relative, lambda m: m.update(status="under-investigation", evidence=[item]))
        self.assertEqual(self.errors(), "")

    def test_translations_must_agree_on_status(self):
        item = {"kind": "literature", "summary": "Mapped prior impedance criteria", "date": TODAY}
        self.edit_entry(ENTRY, lambda m: m.update(status="under-investigation", evidence=[item]))
        self.assertIn("translations disagree on status", self.errors())

    def test_featured_needs_evidence(self):
        self.edit_entry(ENTRY, lambda m: m.update(featured=True))
        self.assertIn("only explorations with recorded evidence can be featured", self.errors())

    def test_required_sections_present_and_ordered(self):
        self.edit_entry(ENTRY, lambda m: None, body=lambda t: t.replace("## Preliminary findings", "## Results"))
        self.assertIn("missing sections ['Preliminary findings']", self.errors())

    def test_sections_out_of_order_are_reported(self):
        def swap(text):
            return text.replace("## Hypothesis", "## TMP").replace("## Research question", "## Hypothesis").replace("## TMP", "## Research question")
        self.edit_entry(ENTRY, lambda m: None, body=swap)
        self.assertIn("required sections are out of order", self.errors())

    def test_hub_links_must_resolve(self):
        self.edit_entry(ENTRY, lambda m: m["hub"].update(produces=["site.invented-model"]))
        self.assertIn("hub.produces site.invented-model is not placed", self.errors())

    def test_background_reading_stays_in_language(self):
        self.edit_entry(ENTRY_ZH, lambda m: m["learn"].append({"title": "x", "url": "/power/microgrids/"}))
        self.assertIn("learn URL /power/microgrids/ is not in zh", self.errors())

    def test_permalink_follows_language_folder(self):
        self.edit_entry(ENTRY_ZH, lambda m: m.update(permalink="/explorations/autonomous-dc-network-stability/"))
        self.assertIn("permalink must be /zh/explorations/autonomous-dc-network-stability/", self.errors())

    def edit_ownership(self, change):
        path = self.root/content_data.OWNERSHIP
        data = json.loads(path.read_text(encoding="utf-8"))
        change(data)
        path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")

    def test_every_post_is_classified(self):
        self.edit_ownership(lambda d: d["posts"].pop(0))
        self.assertIn("is not classified", self.errors())

    def test_learn_posts_name_an_academy_stage(self):
        self.edit_ownership(lambda d: d["posts"][0].update(academy_stage="quantum"))
        self.assertIn("LEARN posts need an academy_stage", self.errors())

    def test_migration_needs_canonical_notice(self):
        def change(data):
            entry = next(p for p in data["posts"] if p["source"].endswith("boost-converter-from-zero-to-everything.md") and p["language"] == "en")
            entry["migration_status"] = "migrated"
        self.edit_ownership(change)
        self.assertIn("migrated posts need an external canonical owner and an academy_source notice", self.errors())


if __name__ == "__main__":
    unittest.main()

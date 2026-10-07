import importlib.util
import json
from pathlib import Path
import shutil
import tempfile
import unittest

import yaml

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("hub_data", ROOT/"tools/hub_data.py")
hub_data = importlib.util.module_from_spec(spec)
spec.loader.exec_module(hub_data)

SKIP_DIRS = {"_site", "vendor", ".git", ".jekyll-cache", ".bundle", "images", "videos", "accessories",
             "tools", "tests", "_includes", "_layouts", ".ecosystem-sources", ".claude", "node_modules"}
SKIP_SUFFIXES = {".png", ".jpg", ".jpeg", ".webp", ".mp4", ".svg", ".pdf", ".gif"}


def ignore(folder, names):
    return [n for n in names if n in SKIP_DIRS or Path(n).suffix.lower() in SKIP_SUFFIXES]


class HubDataTests(unittest.TestCase):
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

    def edit_yaml(self, relative, change):
        path = self.root/relative
        data = yaml.safe_load(path.read_text(encoding="utf-8"))
        change(data)
        path.write_text(yaml.safe_dump(data, allow_unicode=True, sort_keys=False), encoding="utf-8")

    def errors(self):
        return "\n".join(hub_data.validate(self.root)[0])

    def test_repository_hub_data_is_valid(self):
        errors, warnings = hub_data.validate(ROOT)
        self.assertEqual(errors, [])
        self.assertEqual(warnings, [])

    def test_mirror_is_byte_identical_to_registry_endpoint(self):
        self.assertEqual((ROOT/"_data/registry.json").read_bytes(), (ROOT/"aipe.json").read_bytes())

    def test_mirror_drift_is_reported(self):
        (self.root/"_data/registry.json").write_text("{}", encoding="utf-8")
        self.assertIn("differs from aipe.json", self.errors())

    def test_new_registry_capability_must_be_placed(self):
        index = json.loads((self.root/"aipe.json").read_text(encoding="utf-8"))
        extra = dict(index["capabilities"][0], id="aipe.new-capability")
        index["capabilities"].append(extra)
        payload = json.dumps(index).encode("utf-8")
        (self.root/"aipe.json").write_bytes(payload)
        (self.root/"_data/registry.json").write_bytes(payload)
        self.assertIn("aipe.new-capability must be placed exactly once", self.errors())

    def test_unknown_registry_id_is_reported(self):
        self.edit_yaml("_data/hub.yml", lambda d: d["artifacts"].append({"registry": "aipe.missing", "category": "data", "domains": []}))
        self.assertIn("not in aipe.json", self.errors())

    def test_unknown_domain_and_category_are_reported(self):
        def change(data):
            data["artifacts"][0]["domains"] = ["plasma"]
            data["artifacts"][1]["category"] = "widgets"
        self.edit_yaml("_data/hub.yml", change)
        errors = self.errors()
        self.assertIn("unknown domains ['plasma']", errors)
        self.assertIn("unknown category widgets", errors)

    def test_site_artifact_needs_both_languages_and_real_files(self):
        def change(data):
            item = next(a for a in data["artifacts"] if a.get("id") == "site.llc-fha-gain")
            del item["description"]["zh"]
            item["files"].append("/assets/downloads/missing.m")
        self.edit_yaml("_data/hub.yml", change)
        errors = self.errors()
        self.assertIn("description needs en and zh", errors)
        self.assertIn("missing file /assets/downloads/missing.m", errors)

    def test_unresolved_and_untranslated_links_are_reported(self):
        def change(data):
            item = next(a for a in data["artifacts"] if a.get("id") == "site.dab-reference")
            item["links"] = [{"url": "/no/such/page/", "label": {"en": "x", "zh": "x"}, "localised": True}]
        self.edit_yaml("_data/hub.yml", change)
        errors = self.errors()
        self.assertIn("unresolved URL /no/such/page/", errors)
        self.assertIn("no Chinese counterpart for /no/such/page/", errors)

    def test_academy_stage_must_reference_generated_lessons(self):
        self.edit_yaml("_data/academy.yml", lambda d: d["stages"][0]["lessons"].append("/academy/foundations/invented/"))
        self.assertIn("no generated lesson at /academy/foundations/invented/", self.errors())

    def test_unstaged_lesson_is_a_warning_not_an_error(self):
        self.edit_yaml("_data/academy.yml", lambda d: d["stages"][-1]["lessons"].clear())
        errors, warnings = hub_data.validate(self.root)
        self.assertEqual(errors, [])
        self.assertTrue(any("systems-applications" in w for w in warnings))

    def test_featured_positions_are_unique(self):
        def change(data):
            for item in data["artifacts"][:2]:
                item["featured"] = 1
        self.edit_yaml("_data/hub.yml", change)
        self.assertIn("featured positions must be unique", self.errors())


if __name__ == "__main__":
    unittest.main()

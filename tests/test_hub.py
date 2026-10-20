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
        lesson = "/academy/power-electronics/systems-applications/"
        self.edit_yaml("_data/academy.yml", lambda d: [stage["lessons"].remove(lesson) for stage in d["stages"] if lesson in stage["lessons"]])
        errors, warnings = hub_data.validate(self.root)
        self.assertEqual(errors, [])
        self.assertTrue(any("systems-applications" in w for w in warnings))

    def test_academy_stage_labels_need_both_languages(self):
        self.edit_yaml("_data/academy.yml", lambda d: d["stages"][0]["title"].pop("zh"))
        self.assertIn("academy stage foundations: title needs en and zh", self.errors())

    def test_registry_placement_needs_chinese_summary(self):
        def change(data):
            item = next(a for a in data["artifacts"] if a.get("registry") == "aipe.sketch")
            del item["zh_summary"]
        self.edit_yaml("_data/hub.yml", change)
        self.assertIn("aipe.sketch: needs a zh_summary", self.errors())

    def test_agent_cards_need_both_languages_and_real_pages(self):
        def change(data):
            data[1]["page"] = "/resources/ai-agent-team/missing-agent/"
            del data[2]["summary"]["zh"]
            data[0]["status"] = "finished"
        self.edit_yaml("_data/agents.yml", change)
        errors = self.errors()
        self.assertIn("agent pcb-agent: unresolved URL /resources/ai-agent-team/missing-agent/", errors)
        self.assertIn("agent ieee-paper-agent: summary needs en and zh", errors)
        self.assertIn("agent sketch: unknown status finished", errors)

    def test_agent_prompt_reads_its_own_repository(self):
        self.edit_yaml("_data/agents.yml", lambda d: d[0]["prompt"].update(en="Draw my circuit."))
        self.assertIn("agent sketch: en prompt must point the coding agent to https://github.com/FulongLi/AIPE-Sketch", self.errors())

    def test_hub_cards_need_both_languages_and_known_status(self):
        def change(data):
            item = next(a for a in data["artifacts"] if a.get("registry") == "aipe.sketch")
            del item["card"]["summary"]["zh"]
            item["card"]["status"] = "finished"
        self.edit_yaml("_data/hub.yml", change)
        errors = self.errors()
        self.assertIn("aipe.sketch: card summary needs en and zh", errors)
        self.assertIn("unknown card status finished", errors)

    def test_hub_cards_only_in_public_categories(self):
        def change(data):
            item = next(a for a in data["artifacts"] if a.get("id") == "site.llc-fha-gain")
            item["card"] = {"summary": {"en": "x", "zh": "x"}}
        self.edit_yaml("_data/hub.yml", change)
        self.assertIn("only artifacts in a Hub category can carry a card", self.errors())

    def test_every_hub_category_shows_a_card(self):
        def change(data):
            for item in data["artifacts"]:
                if item["category"] == "workflows":
                    item.pop("card", None)
        self.edit_yaml("_data/hub.yml", change)
        self.assertIn("categories.workflows: needs at least one artifact with a card", self.errors())

    def test_excluded_projects_stay_placed_without_cards(self):
        hub = yaml.safe_load((ROOT/"_data/hub.yml").read_text(encoding="utf-8"))
        placed = {a.get("registry"): a for a in hub["artifacts"] if a.get("registry")}
        for capability in ("aipe.simulation-skills", "aipe.design-agent", "aipe.open-source-catalogue"):
            self.assertIn(capability, placed)
            self.assertNotIn("card", placed[capability])

    def test_knowledge_graph_references_must_exist(self):
        def change(data):
            node = next(n for n in data["nodes"] if n["id"] == "pe.buck")
            node["requires"].append("pe.invented")
            node["lessons"].append("/academy/power-electronics/invented/")
            del node["title"]["zh"]
        self.edit_yaml("_data/knowledge_graph.yml", change)
        errors = self.errors()
        self.assertIn("knowledge graph node pe.buck: requires unknown topic pe.invented", errors)
        self.assertIn("knowledge graph node pe.buck: no generated lesson at /academy/power-electronics/invented/", errors)
        self.assertIn("knowledge graph node pe.buck: title needs en and zh", errors)

    def test_knowledge_graph_rejects_prerequisite_cycles(self):
        def change(data):
            node = next(n for n in data["nodes"] if n["id"] == "f.quantities")
            node["requires"] = ["pe.control"]
        self.edit_yaml("_data/knowledge_graph.yml", change)
        self.assertIn("knowledge graph: prerequisite cycle", self.errors())

    def test_academy_subject_needs_its_page(self):
        self.edit_yaml("_data/academy.yml", lambda d: d["stages"][3].update(url="/academy/renewables/"))
        self.assertIn("academy stage renewable-energy: url must be /academy/renewable-energy/", self.errors())

    def test_knowledge_graph_resource_overlay_must_name_known_topics(self):
        self.edit_yaml("_data/knowledge_graph_resources.yml", lambda d: d.update({"pe.unicorn": [{"url": "/hub/", "localised": True, "label": {"en": "x", "zh": "x"}}]}))
        self.assertIn("knowledge_graph_resources.yml: unknown topic pe.unicorn", self.errors())

    def test_lesson_academic_references_must_exist(self):
        lesson = next((p for p in sorted((self.root / "academy").glob("*.md")) if "academic_references:" in p.read_text(encoding="utf-8")), None)
        if lesson is None:
            self.skipTest("no generated lesson cites academic references yet; run the Academy sync")
        text = lesson.read_text(encoding="utf-8").replace("academic_references:", "academic_references:\n- mit-0-000-1999", 1)
        lesson.write_text(text, encoding="utf-8")
        self.assertIn("unknown academic reference mit-0-000-1999", self.errors())

    def test_featured_positions_are_unique(self):
        def change(data):
            for item in data["artifacts"][:2]:
                item["featured"] = 1
        self.edit_yaml("_data/hub.yml", change)
        self.assertIn("featured positions must be unique", self.errors())


if __name__ == "__main__":
    unittest.main()

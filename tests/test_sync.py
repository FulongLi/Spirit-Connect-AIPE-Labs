import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

import yaml

ROOT = Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location("sync",ROOT/"tools/sync_ecosystem.py")
sync=importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)


class SyncTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.base=Path(self.temp.name)
        self.registry=self.base/"registry"
        self.academy=self.base/"academy"
        self.site=self.base/"site"
        for root in (self.registry,self.academy):
            (root/"generated").mkdir(parents=True)
        (self.academy/"curriculum").mkdir()
        body="# Test lesson\n\nAn original lesson.\n"
        (self.academy/"curriculum/lesson.md").write_text(body,encoding="utf-8")
        self.lesson={"slug":"test","domain":"power-electronics","url":"/academy/power-electronics/test/","source":"curriculum/lesson.md","sha256":hashlib.sha256(body.encode()).hexdigest(),"title":"Test","prerequisites":[],"next":[],"language":"en","status":"available","type":"lesson","estimated_time":20}
        self.save_catalogue()
        (self.registry/"generated/aipe.json").write_text(json.dumps({"schema_version":"0.1.0","capabilities":[{"id":"aipe.core"}]}),encoding="utf-8")
        (self.registry/"generated/aipe.md").write_text("# Registry\n",encoding="utf-8")

    def save_catalogue(self):
        (self.academy/"generated/lessons.json").write_text(json.dumps({"schema_version":"0.1.0","lessons":[self.lesson]}),encoding="utf-8")

    def tearDown(self):
        self.temp.cleanup()

    def test_determinism_and_public_paths(self):
        first=sync.make_plan(self.registry,self.academy)
        self.assertEqual(first,sync.make_plan(self.registry,self.academy))
        sync.write_plan(first,self.site)
        self.assertEqual(sync.verify(self.site),4)
        self.assertIn(b"/academy/power-electronics/test/",first["academy/test.md"])

    def test_hash_mismatch_fails_before_writes(self):
        (self.academy/"curriculum/lesson.md").write_text("changed",encoding="utf-8")
        with self.assertRaisesRegex(ValueError,"Stale"):
            sync.make_plan(self.registry,self.academy)
        self.assertFalse(self.site.exists())

    def test_crlf_does_not_change_content_hash(self):
        p=self.academy/"curriculum/lesson.md"
        p.write_bytes(p.read_text(encoding="utf-8").encode().replace(b"\n",b"\r\n"))
        sync.make_plan(self.registry,self.academy)

    def test_slug_traversal(self):
        self.lesson["slug"]="../escape"
        self.save_catalogue()
        with self.assertRaisesRegex(ValueError,"Unsafe"):
            sync.make_plan(self.registry,self.academy)

    def test_missing_reference(self):
        self.lesson["next"]=["missing"]
        self.save_catalogue()
        with self.assertRaisesRegex(ValueError,"reference"):
            sync.make_plan(self.registry,self.academy)

    def test_source_liquid_rejected(self):
        p=self.academy/"curriculum/lesson.md"
        p.write_text("{% include secret %}",encoding="utf-8")
        self.lesson["sha256"]=hashlib.sha256(p.read_bytes()).hexdigest()
        self.save_catalogue()
        with self.assertRaisesRegex(ValueError,"Liquid"):
            sync.make_plan(self.registry,self.academy)

    def test_artifact_tampering(self):
        sync.write_plan(sync.make_plan(self.registry,self.academy),self.site)
        (self.site/"aipe.json").write_text("{}",encoding="utf-8")
        with self.assertRaisesRegex(ValueError,"drift"):
            sync.verify(self.site)

    def asset_case(self, name, content):
        (self.academy/"assets").mkdir(exist_ok=True)
        (self.academy/"assets"/name).write_text(content,encoding="utf-8")
        body=f"# Lesson\n\n[Download](../assets/{name})\n"
        (self.academy/"curriculum/lesson.md").write_text(body,encoding="utf-8")
        self.lesson["sha256"]=hashlib.sha256(body.encode()).hexdigest()
        self.save_catalogue()

    def test_imported_markdown_asset_cannot_execute_jekyll(self):
        self.asset_case("payload.md","---\nlayout: default\n---\n{% include secret.html %}")
        with self.assertRaisesRegex(ValueError,"asset type"):
            sync.make_plan(self.registry,self.academy)

    def test_frontmatter_rejected_even_in_downloads(self):
        self.asset_case("payload.txt","---\nlayout: default\n---\ntext")
        with self.assertRaisesRegex(ValueError,"template"):
            sync.make_plan(self.registry,self.academy)

    def test_svg_active_content_rejected(self):
        self.asset_case("payload.svg",'<svg onload="alert(1)"></svg>')
        with self.assertRaisesRegex(ValueError,"Active SVG"):
            sync.make_plan(self.registry,self.academy)

    def test_output_escape(self):
        with self.assertRaises(ValueError):
            sync.write_plan({"../outside":b"x"},self.site)

    def test_retired_page_cannot_silently_survive_build(self):
        plan=sync.make_plan(self.registry,self.academy)
        lock=json.loads(plan[sync.LOCK])
        lock["artifacts"]["academy/retired.md"]="0"*64
        with self.assertRaisesRegex(ValueError,"artifact set"):
            sync.verify_plan_set(plan,lock)


class SyncV2Tests(unittest.TestCase):
    """Academy catalogue schema 0.2.0: knowledge graph, academic references, translations, labs."""

    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.base=Path(self.temp.name)
        self.registry=self.base/"registry"
        self.academy=self.base/"academy"
        self.site=self.base/"site"
        for root in (self.registry,self.academy):
            (root/"generated").mkdir(parents=True)
        (self.academy/"curriculum").mkdir()
        (self.academy/"labs").mkdir()
        (self.site/"_data").mkdir(parents=True)
        (self.registry/"generated/aipe.json").write_text(json.dumps({"schema_version":"0.1.0","capabilities":[{"id":"aipe.core"}]}),encoding="utf-8")
        (self.registry/"generated/aipe.md").write_text("# Registry\n",encoding="utf-8")
        (self.academy/"labs/dc.py").write_text("print('lab')\n",encoding="utf-8")
        self.en_body="# DC circuits\n\nOriginal lesson. See https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/ and [the lab](../labs/dc.py).\n"
        self.zh_body="# 直流电路\n\n原创课程。\n"
        (self.academy/"curriculum/dc.md").write_text(self.en_body,encoding="utf-8")
        (self.academy/"curriculum/dc.zh-CN.md").write_text(self.zh_body,encoding="utf-8")
        common={"domain":"foundations","track":"circuits","module":"f.dc-circuits","covers":["f.quantities"],"level":"beginner","type":"lesson","status":"available","prerequisites":[],"next":[],"estimated_time":60,"format":"aipe-lesson-v2","translation_status":"original"}
        self.en={**common,"slug":"dc","concept":"dc","url":"/academy/foundations/dc/","source":"curriculum/dc.md","sha256":hashlib.sha256(self.en_body.encode()).hexdigest(),"title":"DC circuits","language":"en","labs":["labs/dc.py"],"academic_references":["mit-6-002-2007"],"translations":{"en":"dc","zh-CN":"dc-zh"}}
        self.zh={**common,"slug":"dc-zh","concept":"dc","url":"/academy/foundations/dc-zh/","source":"curriculum/dc.zh-CN.md","sha256":hashlib.sha256(self.zh_body.encode()).hexdigest(),"title":"直流电路","language":"zh-CN","labs":[],"academic_references":[],"translations":{"en":"dc","zh-CN":"dc-zh"}}
        self.graph={"schema_version":"0.2.0","domains":[{"id":"foundations","order":1,"title":{"en":"Foundations","zh":"基础"},"summary":{"en":"s","zh":"s"},"color":"#c79522","tracks":["circuits"]}],
                    "tracks":[{"id":"circuits","domain":"foundations","order":1,"title":{"en":"Circuits","zh":"电路"},"summary":{"en":"s","zh":"s"},"modules":["f.quantities","f.dc-circuits"]}],
                    "modules":[{"id":"f.quantities","domain":"foundations","track":"circuits","title":{"en":"Quantities","zh":"数量"},"summary":{"en":"q","zh":"q"},"requires":[],"related":[],"lessons":["dc","dc-zh"],"status":"available","academic_references":[]},
                               {"id":"f.dc-circuits","domain":"foundations","track":"circuits","title":{"en":"DC circuits","zh":"直流电路"},"summary":{"en":"d","zh":"d"},"requires":["f.quantities"],"related":[],"lessons":["dc","dc-zh"],"status":"available","academic_references":[{"id":"mit-6-002-2007","coverage":"core"}]}],
                    "learning_paths":[],"lesson_count":2}
        self.references={"schema_version":"0.2.0","relationship":"baseline","license_note":"CC BY-NC-SA 4.0 at MIT","courses":[{"id":"mit-6-002-2007","course_number":"6.002","title":"Circuits and Electronics","term":"Spring 2007","url":"https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/","primary_domain":"foundations","secondary_domains":[],"academic_level":"undergraduate","priority":"core","resource_status":"verified","verified_on":"2026-10-20","instructors":["Prof. Anant Agarwal"],"level":["Undergraduate"],"learning_resource_types":[],"key_resources":[],"topics":["circuits"],"mapped_modules":[{"module":"f.dc-circuits","coverage":"core"}],"coverage_notes":"","gaps":[],"access_limitations":[],"lessons":["dc"]}]}
        (self.site/"_data/knowledge_graph_resources.yml").write_text("f.dc-circuits:\n- url: /hub/\n  localised: true\n  label: {en: Hub, zh: Hub}\n",encoding="utf-8")
        self.save()

    def save(self):
        (self.academy/"generated/lessons.json").write_text(json.dumps({"schema_version":"0.2.0","lessons":[self.en,self.zh]},ensure_ascii=False),encoding="utf-8")
        (self.academy/"generated/knowledge-graph.json").write_text(json.dumps(self.graph,ensure_ascii=False),encoding="utf-8")
        (self.academy/"generated/academic-references.json").write_text(json.dumps(self.references,ensure_ascii=False),encoding="utf-8")

    def tearDown(self):
        self.temp.cleanup()

    def plan(self):
        return sync.make_plan(self.registry,self.academy,self.site)

    def test_lesson_pages_carry_v2_metadata_and_translations(self):
        plan=self.plan()
        page=plan["academy/dc.md"].decode("utf-8")
        for needle in ("module: f.dc-circuits","concept: dc","lesson_format: aipe-lesson-v2","- mit-6-002-2007","canonical_source_url: https://github.com/FulongLi/AIPE-Academy/blob/main/curriculum/dc.md","- labs/dc.py","- https://github.com/FulongLi/AIPE-Academy/blob/main/labs/dc.py","zh: /academy/foundations/dc-zh/","zh_url: /academy/foundations/dc-zh/"):
            self.assertIn(needle,page)
        self.assertIn("[the lab](https://github.com/FulongLi/AIPE-Academy/blob/main/labs/dc.py)",page)
        zh=plan["academy/dc-zh.md"].decode("utf-8")
        self.assertIn("lang: zh",zh)
        self.assertIn("en_url: /academy/foundations/dc/",zh)

    def test_graph_and_reference_data_are_generated(self):
        plan=self.plan()
        self.assertIn(sync.GRAPH_OUT,plan)
        self.assertIn(sync.REFERENCES_OUT,plan)
        self.assertIn(sync.ACADEMY_GRAPH_OUT,plan)
        graph=yaml.safe_load(plan[sync.GRAPH_OUT].decode("utf-8"))
        node={n["id"]:n for n in graph["nodes"]}["f.dc-circuits"]
        self.assertEqual(node["subject"],"foundations")
        self.assertEqual(node["requires"],["f.quantities"])
        self.assertEqual(node["lessons"],["/academy/foundations/dc/","/academy/foundations/dc-zh/"])
        self.assertEqual(node["resources"][0]["url"],"/hub/")
        self.assertEqual(node["title"],{"en":"DC circuits","zh":"直流电路"})
        self.assertEqual(json.loads(plan[sync.REFERENCES_OUT]),self.references)
        lock=json.loads(plan[sync.LOCK])
        self.assertEqual(lock["sources"]["academy"]["catalogue_schema"],"0.2.0")
        self.assertIn("graph_sha256",lock["sources"]["academy"])
        sync.write_plan(plan,self.site)
        self.assertEqual(sync.verify(self.site),len(plan)-1)

    def test_unknown_overlay_topic_rejected(self):
        (self.site/"_data/knowledge_graph_resources.yml").write_text("pe.unicorn:\n- url: /hub/\n  label: {en: x, zh: x}\n",encoding="utf-8")
        with self.assertRaisesRegex(ValueError,"unknown topic"):
            self.plan()

    def test_unknown_academic_reference_rejected(self):
        self.en["academic_references"]=["mit-0-000-1999"]
        self.save()
        with self.assertRaisesRegex(ValueError,"unknown academic reference"):
            self.plan()

    def test_missing_lab_rejected(self):
        self.en["labs"]=["labs/missing.py"]
        self.save()
        with self.assertRaisesRegex(ValueError,"lab script"):
            self.plan()

    def test_schema_mismatch_between_generated_files_rejected(self):
        self.graph["schema_version"]="0.1.0"
        self.save()
        with self.assertRaisesRegex(ValueError,"schema version"):
            self.plan()


if __name__ == "__main__":
    unittest.main()

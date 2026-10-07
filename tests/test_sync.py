import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

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


if __name__ == "__main__":
    unittest.main()

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, "Startup theme script must be present");

for (const [name, saved, expected] of [
  ["defaults to dark", null, "dark"],
  ["restores light", "light", "light"],
  ["restores dark", "dark", "dark"],
  ["ignores invalid values", "system", "dark"],
  ["ignores empty values", "", "dark"],
]) {
  test(name, () => {
    let applied;
    runInNewContext(script, {
      localStorage: {
        getItem: (key) => {
          assert.equal(key, "opspilot-theme");
          return saved;
        },
      },
      document: {
        documentElement: {
          setAttribute: (key, value) => {
            assert.equal(key, "data-theme");
            applied = value;
          },
        },
      },
    });
    assert.equal(applied, expected);
  });
}
test("blocked storage still applies dark", () => {
  let applied;
  runInNewContext(script, {
    localStorage: {
      getItem: () => {
        throw new Error("Storage blocked");
      },
    },
    document: {
      documentElement: {
        setAttribute: (_key, value) => {
          applied = value;
        },
      },
    },
  });
  assert.equal(applied, "dark");
});
test("theme is initialized before React entry", () => {
  assert.ok(html.indexOf("<script>") < html.indexOf('src="/src/main.tsx"'));
});

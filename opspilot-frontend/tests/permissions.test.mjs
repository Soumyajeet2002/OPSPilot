import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";
const source = readFileSync(
  new URL("../src/features/auth/permissions.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
});
const { canAccess } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
test("unknown authorization fails closed", () =>
  assert.equal(canAccess(null, {}), false));
test("Admin role does not implicitly grant permissions", () =>
  assert.equal(
    canAccess(
      { roles: ["Admin"], permissions: [] },
      { allPermissions: ["employees:write"] },
    ),
    false,
  ));
test("HR grant requires matching role and permission", () =>
  assert.equal(
    canAccess(
      { roles: ["HR"], permissions: ["employees:read"] },
      { anyRole: ["Admin", "HR"], allPermissions: ["employees:read"] },
    ),
    true,
  ));
test("missing one permission denies access", () =>
  assert.equal(
    canAccess(
      { roles: ["HR"], permissions: ["employees:read"] },
      { allPermissions: ["employees:read", "employees:write"] },
    ),
    false,
  ));
test("future roles are supported without implicit grants", () =>
  assert.equal(
    canAccess(
      { roles: ["Analyst"], permissions: ["reports:read"] },
      { anyRole: ["Analyst"], allPermissions: ["reports:read"] },
    ),
    true,
  ));

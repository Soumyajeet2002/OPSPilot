import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(
  new URL("../src/features/auth/auth-contract.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2023,
  },
});
const { validLogin } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
const valid = {
  success: true,
  data: {
    accessToken: "test-token",
    tokenType: "Bearer",
    expiresIn: 900,
    user: {
      id: "test-id",
      email: "test@example.invalid",
      firstName: "Test",
      lastName: "User",
    },
  },
};
test("accepts the verified backend login shape", () =>
  assert.equal(validLogin(valid), true));
for (const [name, value] of [
  ["null", null],
  ["empty object", {}],
  ["failed authentication", { ...valid, success: false }],
  ["missing data", { success: true }],
  ["empty token", { ...valid, data: { ...valid.data, accessToken: "" } }],
  [
    "invalid token scheme",
    { ...valid, data: { ...valid.data, tokenType: "Basic" } },
  ],
  ["expired token", { ...valid, data: { ...valid.data, expiresIn: 0 } }],
  [
    "invalid expiry",
    { ...valid, data: { ...valid.data, expiresIn: Infinity } },
  ],
  ["missing user", { ...valid, data: { ...valid.data, user: null } }],
  [
    "missing identity",
    { ...valid, data: { ...valid.data, user: { ...valid.data.user, id: "" } } },
  ],
  [
    "malformed identity",
    {
      ...valid,
      data: { ...valid.data, user: { ...valid.data.user, email: 123 } },
    },
  ],
])
  test(`rejects ${name}`, () => assert.equal(validLogin(value), false));

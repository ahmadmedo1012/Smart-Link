import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // r13: generated test artifacts — running eslint AFTER a test run
    // (locally or in CI) otherwise drags the Playwright report's bundled
    // vendor JS into the lint (thousands of unrelated problems).
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;

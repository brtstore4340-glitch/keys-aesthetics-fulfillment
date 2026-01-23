/* AUTO-GENERATED (BUG_FIX): Prevents @typescript-eslint/no-unused-expressions crash on ESLint 8.57.1 */
const has = (name) => {
  try { require.resolve(name); return true; } catch { return false; }
};

const tsParser = has("@typescript-eslint/parser") ? require("@typescript-eslint/parser") : null;
const tsPlugin = has("@typescript-eslint/eslint-plugin") ? require("@typescript-eslint/eslint-plugin") : null;

module.exports = [
  { ignores: ["node_modules/**", "lib/**", "dist/**", "coverage/**", ".firebase/**"] },

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ...(tsParser ? { parser: tsParser } : {}),
      parserOptions: { ecmaFeatures: { jsx: false } },
    },
    plugins: {
      ...(tsPlugin ? { "@typescript-eslint": tsPlugin } : {}),
    },
    rules: {
      // HARD BLOCKER FIX:
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": "off",

      // Reasonable defaults (non-blocking)
      "no-console": "off",
      "no-debugger": "error",
      ...(tsPlugin ? {
        "@typescript-eslint/no-unused-vars": ["error", {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        }],
        "@typescript-eslint/no-explicit-any": "off",
      } : {}),
    },
  },
];

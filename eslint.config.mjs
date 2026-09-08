import js from "@eslint/js";
import globals from "globals";
import sonarjs from "eslint-plugin-sonarjs";
import reactPlugin from "eslint-plugin-react";

export default [
  js.configs.recommended,
  sonarjs.configs.recommended,
  {
    files: ["src/**/*.{js,jsx}"],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  {
    ignores: [
      "dist/**",
      "coverage/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "e2e/**",
      "**/*.test.{js,jsx}",
      "src/test/**",
    ],
  },
];

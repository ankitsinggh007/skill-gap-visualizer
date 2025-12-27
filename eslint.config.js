import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import babelParser from "@babel/eslint-parser";
import prettier from "eslint-config-prettier";

export default [
  // 🔒 Ignore backend + build + env files completely
  {
    ignores: [
      "api/**",
      "lib/**",
      "tests/**",
      "dist/**",
      "node_modules/**",
      ".vite/**",
      ".vercel/**",
      "*.config.js",
    ],
  },

  {
    // 🎯 Only lint frontend source code
    files: ["src/**/*.{js,jsx}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: babelParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        requireConfigFile: false,
        babelOptions: {
          plugins: ["@babel/plugin-syntax-jsx"],
        },
      },
      globals: {
        document: "readonly",
        window: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        FileReader: "readonly",
        URL: "readonly",
        fetch: "readonly",
      },
    },

    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },

    rules: {
      // JS recommended rules
      ...js.configs.recommended.rules,

      // React rules
      ...react.configs.recommended.rules,

      // Hooks rules
      ...reactHooks.configs.recommended.rules,

      // Accessibility rules
      ...jsxA11y.configs.recommended.rules,

      // Disable Prettier conflicts
      ...prettier.rules,

      // Custom tweaks
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "warn",
    },

    settings: {
      react: { version: "detect" },
    },
  },
];
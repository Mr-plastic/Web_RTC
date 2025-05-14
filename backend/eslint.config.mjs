import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    // for all js file
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,     //  Node.js global varibale ex: console, process
      },
    },
  },
  {
    // frontend
    files: ["public/**/*.js", "frontend/**/*.js"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // test file
    files: ["__test__/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,     //  Node.js global varibale ex: console, process
      },
    },
  },
]);

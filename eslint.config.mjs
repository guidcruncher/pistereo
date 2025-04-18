import tsParser from "@typescript-eslint/parser";
import tseslint from 'typescript-eslint';
import path from "node:path";
import { fileURLToPath } from "node:url";
import eslint from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import unusedImports from "eslint-plugin-unused-imports";
import simpleImportSort from "eslint-plugin-simple-import-sort";

// const simpleImportSort = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: eslint.configs.recommended,
    allConfig: eslint.configs.all
});

export default [ ...compat.extends("plugin:@typescript-eslint/strict"), {
 plugins: {
      "unused-imports": unusedImports,
      "simple-import-sort":simpleImportSort,
    },
    languageOptions: {
        parser: tsParser,
    },

    rules: {
        "@typescript-eslint/no-this-alias": "off",
        "@typescript-eslint/no-dynamic-delete": "off",
        "@typescript-eslint/no-empty-function": "warn",
        "@typescript-eslint/adjacent-overload-signatures": "off",
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-extraneous-class": "off",
	"lines-between-class-members": "warn",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
            "warn",
            {
                "vars": "all",
                "varsIgnorePattern": "^_",
                "args": "after-used",
                "argsIgnorePattern": "^_",
            },
        ],
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
    },
}, ...tseslint.configs.stylistic];

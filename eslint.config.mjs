import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Change these rules to 'warn' instead of 'error'
      "no-console": "warn",                    // Warn instead of error for console logs
      "no-unused-vars": "warn",               // Warn instead of error for unused variables
      "@typescript-eslint/no-unused-vars": "warn", // TypeScript specific for unused vars
      "@typescript-eslint/no-explicit-any": "warn", // Warn instead of error for explicit 'any' types
      "react/prop-types": "warn",             // Warn instead of error for missing prop types
    },
  }
];

export default eslintConfig;

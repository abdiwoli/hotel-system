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
      // Make all rules 'warn' instead of 'error'
      "no-console": "warn",
      "no-unused-vars": "warn", // Example: warning for unused vars instead of error
      "react/prop-types": "warn", // Example: warning for missing prop types
    }
  }
];

export default eslintConfig;

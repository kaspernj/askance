import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      "comma-dangle": ["error", "never"],
      "semi": ["error", "never"]
    }
  },
  {
    files: ["tests/**/*.mjs"],
    languageOptions: {
      parserOptions: {
        projectService: false
      }
    }
  }
)

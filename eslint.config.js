import { defineConfig } from "eslint/config";
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'prettier/prettier': [
        'error',
        {
          semi: false,
          tabWidth: 2,
          singleQuote: true,
        },
      ],
      camelcase: 'warn',
      'vue/no-v-html': 'off',
    }
  }
)

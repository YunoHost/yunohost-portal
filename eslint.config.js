import withNuxt from './.nuxt/eslint.config.mjs';
import prettier from 'eslint-plugin-prettier/recommended';
import vue from 'eslint-plugin-vue';
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility';

let configs = [
  ...vue.configs['flat/recommended'],
  ...pluginVueA11y.configs['flat/recommended'],
  prettier,
  {
    rules: {
      camelcase: 'warn',
      'vue/no-v-html': 'off',
      'prettier/prettier': [
        'error',
        {
          overrides: [
            {
              files: 'i18n/**/*.json',
              options: {
                tabWidth: 4,
              },
            },
            {
              files: ['*.vue', '*.ts', '*.js'],
              options: {
                singleQuote: true,
                semi: true,
              },
            },
          ],
        },
      ],
    },
  },
];
export default withNuxt(configs);

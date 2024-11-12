import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import _import from 'eslint-plugin-import';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/.eslintrc.cjs',
      '**/*.config.js',
      '**/*.config.cjs',
      '**/*.config.mjs',
      '**/.next',
      '**/dist',
      '**/pnpm-lock.yaml',
    ],
  },
  ...compat.extends(
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'prettier'
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'eslint-plugin-import': fixupPluginRules(_import),
    },

    linterOptions: {
      reportUnusedDisableDirectives: true,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        projectService: true,
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'react/prop-types': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],

      '@typescript-eslint/no-misused-promises': [
        2,
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],

      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    },
  },
];

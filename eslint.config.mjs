// @ts-check

import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import reactCompiler from 'eslint-plugin-react-compiler';
import unusedImports from 'eslint-plugin-unused-imports';
import reactHooks from 'eslint-plugin-react-hooks';
import { configs } from 'typescript-eslint';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

// Import Next.js config via compatibility layer
const nextEslintConfig = compat.extends('next/core-web-vitals');

export default [
  ...nextEslintConfig,
  eslint.configs.recommended,
  ...configs.recommended,
  {
    ignores: [
      '**/**/node_modules',
      '**/**/.next',
      '**/**/public',
      'components/ui',
      'env.js',
      '**/.eslintrc.cjs',
      '**/*.config.js',
      '**/*.config.cjs',
      '**/*.config.mjs',
      '.next',
      'dist',
      'pnpm-lock.yaml',
      'next-env.d.ts',
    ],
  },
  {
    plugins: {
      'unused-imports': unusedImports,
      'react-compiler': reactCompiler,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
  },
  {
    rules: {
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-misused-promises': [
        2,
        { checksVoidReturn: { attributes: false } },
      ],
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    },
  },
];

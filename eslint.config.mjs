// @ts-check
import { defineConfig } from 'eslint/config';

import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['node_modules/**', 'lib/**', 'dist/**'],
  },
  {
    files: ['**/*.{js,ts}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, prettierConfig],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
]);

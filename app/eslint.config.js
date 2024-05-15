import { FlatCompat } from '@eslint/eslintrc';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import globals from 'globals';
import jsoncParser from 'jsonc-eslint-parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import esImport from 'eslint-plugin-import';

// Mimic CommonJS variables (not needed if using CommonJS).
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Backwards compatibility: translates eslintrc format into flat config format.
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Provide base and additional configurations.
  js.configs.recommended,
  // Mimic eslintrc-style 'extends' for not yet compatible configs with the new flat config format.
  ...compat.extends('eslint-config-airbnb-base'),
  // Define config objects (flat cascading order).
  {
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        // Eslint doesn't supply ecmaVersion in `parser.js` `context.parserOptions`
        // This is required to avoid ecmaVersion < 2015 error or 'import' / 'export' error
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      import: esImport,
    },
    settings: {
      'import/parsers': {
        espree: ['.js', '.cjs', '.mjs', '.jsx'],
      },
      'import/resolver': {
        node: true,
        alias: {
          map: [
            ['@', [join(__dirname, 'src'), join(__dirname, 'dist'), '']],
            ['@controllers', join(__dirname, 'src', 'controllers')],
            ['@routers', join(__dirname, 'src', 'routers')],
          ],
        },
      },
    },
    rules: {
      'import/extensions': [
        'error',
        {
          js: 'ignorePackages',
        },
      ],
      'no-console': ['warn', { allow: ['info', 'error'] }],
      'no-underscore-dangle': ['error', { allow: ['__dirname'] }],
    },
  },
  // Config object to globally exclude listed files from linting.
  {
    ignores: [
      'dist',
      'public',
      'node_modules',
      'eslint.config.js',
      'postcss.config.js',
      'vitest.config.js',
      'vite.config.js',
    ],
  },
  {
    files: ['*.json'],
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {},
  },
  {
    files: ['./src/**/*.js', './src/**/*.jsx'],
    rules: {
      ...js.configs.recommended.rules,
      ...esImport.configs.recommended.rules,
      '@import/no-extraneous-dependencies': [
        'error',
        { devDependencies: true },
      ],
    },
  },
  eslintConfigPrettier,
];

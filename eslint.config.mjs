import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { defineConfig, globalIgnores } from 'eslint/config';

const tsFiles = ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'];

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: tsFiles,
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: ['.mjs'],
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_$',
          varsIgnorePattern: '^_$',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      'no-unneeded-ternary': 'error',
      'no-extra-boolean-cast': 'error',
      'no-throw-literal': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
    },
  },
  // Keep Next.js default ignores.
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    '.open-next/**',
    'next-env.d.ts',
    'src/third_party/tweakcn/**',
  ]),
]);

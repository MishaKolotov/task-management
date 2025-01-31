module.exports = [
  {
    files: ['src/**/*.ts', 'src/**/*.html'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: 'tsconfig.json',
        ecmaVersion: 2020,
        extraFileExtensions: ['.html'],
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      'simple-import-sort': require('eslint-plugin-simple-import-sort'),
      'unused-imports': require('eslint-plugin-unused-imports'),
    },
    rules: {
      'quotes': ['error', 'single'],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^(@angular|rxjs|zone\\.js|core-js)(/.*|$)'],
            ['^@?\\w'],
            ['^src/'],
            ['^\\.'],
          ],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      'object-curly-spacing': ['error', 'always'],
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-empty-function': 'warn',
    },
  },
  {
    files: ['*.html'],
    plugins: {
      '@angular-eslint/template': require('@angular-eslint/eslint-plugin-template'),
    },
    rules: {
      '@angular-eslint/template/no-any': 'error',
    },
  },
];

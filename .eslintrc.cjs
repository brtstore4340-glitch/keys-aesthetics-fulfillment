module.exports = {
  root: true,
  ignorePatterns: ['dist', '**/*.{ts,tsx}'],
  env: {
    browser: true,
    es2020: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  overrides: [
    {
      files: ['apps/fulfillment-web/src/scripts/**/*.js'],
      env: {
        node: true,
      },
    },
  ],
}

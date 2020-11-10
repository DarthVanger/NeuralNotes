module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  settings: {
    react: {
      createClass: 'createReactClass', // Regex for Component Factory to use,
      // default to "createReactClass"
      pragma: 'React', // Pragma to use, default to "React"
      version: 'detect',
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'class-property', 'import'],
  rules: {
    'no-console': 'off',
    'react/prop-types': 0,
    'object-curly-spacing': ['error', 'always'],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'import/order': [
      'error',
      {
        'groups': ["builtin", "external", "parent", "sibling", "index"],
        'pathGroups': [
          {
            'pattern': 'react',
            'group': 'external',
            'position': 'before'
          },
          {
            'pattern': 'auth/**',
            'group': 'external',
            'position': 'after'
          },
          {
            'pattern': 'components/**',
            'group': 'external',
            'position': 'after'
          },
          {
            'pattern': 'selectors/**',
            'group': 'external',
            'position': 'after'
          },
          {
            'pattern': 'libs/**',
            'group': 'external',
            'position': 'after'
          },
          {
            'pattern': 'helpers/**',
            'group': 'external',
            'position': 'after'
          }
        ],
        'pathGroupsExcludedImportTypes': ['react'],
        'newlines-between': 'always',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true
        }
      }
    ],
  },
};

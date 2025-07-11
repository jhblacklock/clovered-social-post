module.exports = {
    extends: ['next', 'prettier'],
    plugins: ['unicorn'],
    ignorePatterns: ['**/.next/**', '.next/**', '.next'],
    rules: {
      'no-unused-vars': [
        'error',
        {
          args: 'after-used',
          caughtErrors: 'none',
          ignoreRestSiblings: true,
          vars: 'all',
          argsIgnorePattern: '^_'
        }
      ],
      'prefer-const': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase'
        }
      ]
    }
  };
  
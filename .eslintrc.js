module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    plugins: ['eslint-plugin-simple-import-sort'],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        'react/prop-types': 'off',
        'simple-import-sort/sort': 'warn',
        'sort-imports': 'off',
        'import/order': 'off',
        'import/prefer-default-export': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-var-requires': 'off',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};

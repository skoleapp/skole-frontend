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
        'react/display-name': 'off',
        '@typescript-eslint/ban-ts-ignore': 'off',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};

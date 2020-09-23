# Skole Frontend Dependencies

This document explains the need for every top level dependency the project has.
All `@types/*` are ignored as they are only used to provide TypeScript typings for their dedicated library code.

## NPM

### Prod requirements

| Dependency                                                                         | Reason                                                                                        |
| :--------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| [@apollo/client](https://www.npmjs.com/package/@apollo/client)                     | Client library for executing GraphQL operations.                                              |
| [@material-ui/core](https://www.npmjs.com/package/@material-ui/core)               | Core package for Material UI components.                                                      |
| [@material-ui/icons](https://www.npmjs.com/package/@material-ui/icons)             | Library for using [Material Icons](https://material.io/resources/icons/).                     |
| [@material-ui/lab](https://www.npmjs.com/package/@material-ui/lab)                 | Material UI extension for more experimental components.                                       |
| [apollo-upload-client](https://www.npmjs.com/package/apollo-upload-client)         | Allows file uploads with GraphQL mutations.                                                   |
| [cookie](https://www.npmjs.com/package/cookie)                                     | Allows reading/writing client-side cookies.                                                   |
| [dayjs](https://www.npmjs.com/package/days)                                        | Immutable date library.                                                                       |
| [draft-js](https://www.npmjs.com/package/draft-js)                                 | Rich text editor.                                                                             |
| [formik](https://www.npmjs.com/package/formik)                                     | Provides useful and extensible form logic.                                                    |
| [graphql](https://www.npmjs.com/package/graphql)                                   | Only used for getting useful GraphQL typings.                                                 |
| [lodash.throttle](https://www.npmjs.com/package/lodash.thorttle)                   | Single utility function from [Lodash](https://www.npmjs.com/package/lodash).                  |
| [material-ui-confirm](https://www.npmjs.com/package/material-ui-confirm)           | MUI wrapper for confirmation dialogs.                                                         |
| [next](https://www.npmjs.com/package/next)                                         | Rendering framework for [React](https://www.npmjs.com/package/react).                         |
| [next-18next](https://www.npmjs.com/package/next-18next)                           | I18n support for [Next.js](https://www.npmjs.com/package/next).                               |
| [next-offline](https://www.npmjs.com/package/next-offline)                         | Offline support for [Next.js](https://www.npmjs.com/package/next).                            |
| [print-js](https://www.npmjs.com/package/print-js)                                 | Used for printing single resources.                                                           |
| [ramda](https://www.npmjs.com/package/ramda)                                       | Our go-to utility library.                                                                    |
| [react](https://www.npmjs.com/package/react)                                       | Duh.                                                                                          |
| [react-dom](https://www.npmjs.com/package/react-dom)                               | Duh.                                                                                          |
| [react-image-file-resizer](https://www.npmjs.com/package/react-image-file-resizer) | Used for resizing uploaded images.                                                            |
| [react-pdf](https://www.npmjs.com/package/react-pdf)                               | Render PDF files.                                                                             |
| [react-swipeable-views](https://www.npmjs.com/package/react-swipeable-views)       | Swipeable views in browser environment.                                                       |
| [typeface-roboto](https://www.npmjs.com/package/typeface-roboto)                   | Font.                                                                                         |
| [yup](https://www.npmjs.com/package/yup)                                           | Object schema validation (used together with [Formik](https://www.npmjs.com/package/formik)). |

### Dev requirements

| Dependency                                                                                                         | Reason                                                                                              |
| :----------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- |
| [@graphql-codegen/cli](https://www.npmjs.com/package/@graphql-codegen/cli)                                         | Generate API functions from GraphQL code.                                                           |
| [@graphql-codegen/typescript-operations](https://www.npmjs.com/package/@graphql-codegen/typescript-operations)     | TypeScript plugin for [GraphQL Code Gen](https://www.npmjs.com/package/@graphql-codegen/cli)        |
| [@graphql-codegen/typescript-react-apollo](https://www.npmjs.com/package/@graphql-codegen/typescript-react-apollo) | Apollo/TypeScript plugin for [GraphQL Code Gen](https://www.npmjs.com/package/@graphql-codegen/cli) |
| [eslint](https://www.npmjs.com/package/eslint)                                                                     | Linter.                                                                                             |
| [eslint-plugin-prettier](https://www.npmjs.com/package/eslint-plugin-prettier)                                     | Plugin for integrating ESLint with [Prettier](https://www.npmjs.com/package/prettier).              |
| [typescript](https://www.npmjs.com/package/typescript)                                                             | Duh.                                                                                                |

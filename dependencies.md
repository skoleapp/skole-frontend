# Skole Frontend Dependencies

This document explains the need for every top level dependency the project has.
All `@types/*` are ignored as they are only used to provide TypeScript typings for their dedicated library code.

## NPM

### Prod requirements

| Dependency                                                                           | Reason                                                                                        |
| :----------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| [@apollo/client](https://www.npmjs.com/package/@apollo/client)                       | Client library for executing GraphQL operations.                                              |
| [@material-ui/core](https://www.npmjs.com/package/@material-ui/core)                 | Core package for Material UI components.                                                      |
| [@material-ui/icons](https://www.npmjs.com/package/@material-ui/icons)               | Library for using [Material Icons](https://material.io/resources/icons/).                     |
| [@material-ui/lab](https://www.npmjs.com/package/@material-ui/lab)                   | Material UI extension for more experimental components.                                       |
| [apollo-upload-client](https://www.npmjs.com/package/apollo-upload-client)           | Allows file uploads with GraphQL mutations.                                                   |
| [browser-image-compression](https://www.npmjs.com/package/browser-image-compression) | Used for resizing uploaded images.                                                            |
| [clsx](https://www.npmjs.com/package/clsx)                                           | A minimalistic library to connect Material UI classes.                                        |
| [dayjs](https://www.npmjs.com/package/days)                                          | Immutable date library.                                                                       |
| [draft-js](https://www.npmjs.com/package/draft-js)                                   | Rich text editor.                                                                             |
| [formik](https://www.npmjs.com/package/formik)                                       | Provides useful and extensible form logic.                                                    |
| [graphql](https://www.npmjs.com/package/graphql)                                     | Only used for getting useful GraphQL typings.                                                 |
| [lodash.throttle](https://www.npmjs.com/package/lodash.thorttle)                     | Single utility function from [Lodash](https://www.npmjs.com/package/lodash).                  |
| [next](https://www.npmjs.com/package/next)                                           | Rendering framework for [React](https://www.npmjs.com/package/react).                         |
| [next-offline](https://www.npmjs.com/package/next-offline)                           | Offline support for [Next.js](https://www.npmjs.com/package/next).                            |
| [next-translate](https://www.npmjs.com/package/next-translate)                       | I18n support for [Next.js](https://www.npmjs.com/package/next).                               |
| [nprogress](https://www.npmjs.com/package/nprogress)                                 | Provides the loading bar.                                                                     |
| [print-js](https://www.npmjs.com/package/print-js)                                   | Used for printing single resources.                                                           |
| [ramda](https://www.npmjs.com/package/ramda)                                         | Our go-to utility library.                                                                    |
| [react](https://www.npmjs.com/package/react)                                         | Duh.                                                                                          |
| [react-dom](https://www.npmjs.com/package/react-dom)                                 | Duh.                                                                                          |
| [react-pdf](https://www.npmjs.com/package/react-pdf)                                 | Render PDF files.                                                                             |
| [typeface-roboto](https://www.npmjs.com/package/typeface-roboto)                     | Font.                                                                                         |
| [yup](https://www.npmjs.com/package/yup)                                             | Object schema validation (used together with [Formik](https://www.npmjs.com/package/formik)). |

### Dev requirements (excluding plugins and TypeScript typings)

| Dependency                                                                 | Reason                                                      |
| :------------------------------------------------------------------------- | :---------------------------------------------------------- |
| [@graphql-codegen/cli](https://www.npmjs.com/package/@graphql-codegen/cli) | Generate API functions from GraphQL code.                   |
| [dpdm](https://www.npmjs.com/package/dpdm)                                 | A tool that we use to check for circular dependencies.      |
| [eslint](https://www.npmjs.com/package/eslint)                             | Linter.                                                     |
| [graphql-let](https://www.npmjs.com/package/graphql-let)                   | GraphQL Code Generator wrapper to automate code generation. |
| [prettier](https://www.npmjs.com/package/prettier)                         | Formatter.                                                  |
| [typescript](https://www.npmjs.com/package/typescript)                     | Duh.                                                        |

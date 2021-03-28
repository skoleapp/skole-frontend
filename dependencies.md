# Skole Frontend Dependencies

This document explains the need for every top level dependency the project has.

## NPM

### Prod Requirements

| Dependency                                                                           | Reason                                                                                        |
| :----------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| [@apollo/client](https://www.npmjs.com/package/@apollo/client)                       | Client library for executing GraphQL operations.                                              |
| [@cypress/code-coverage](https://www.npmjs.com/package/@cypress/code-coverage)       | Code coverage for Cypress.                                                                    |
| [@material-ui/core](https://www.npmjs.com/package/@material-ui/core)                 | Core package for Material UI components.                                                      |
| [@material-ui/icons](https://www.npmjs.com/package/@material-ui/icons)               | Library for using [Material Icons](https://fonts.google.com/icons).                           |
| [@material-ui/lab](https://www.npmjs.com/package/@material-ui/lab)                   | Material UI extension for more experimental components.                                       |
| [apollo-upload-client](https://www.npmjs.com/package/apollo-upload-client)           | Allows file uploads with GraphQL mutations.                                                   |
| [babel-plugin-istanbul](https://www.npmjs.com/package/babel-plugin-istanbul)         | Babel plugin for instrumenting code for code coverage.                                        |
| [browser-image-compression](https://www.npmjs.com/package/browser-image-compression) | Used for resizing uploaded images.                                                            |
| [clsx](https://www.npmjs.com/package/clsx)                                           | A minimalistic library to connect Material UI classes.                                        |
| [dayjs](https://www.npmjs.com/package/days)                                          | Immutable date library.                                                                       |
| [formik](https://www.npmjs.com/package/formik)                                       | Provides useful and extensible form logic.                                                    |
| [graphql](https://www.npmjs.com/package/graphql)                                     | Only used for getting useful GraphQL typings.                                                 |
| [gray-matter](https://www.npmjs.com/package/gray-matter)                             | Parse content from Markdown files.                                                            |
| [lodash.throttle](https://www.npmjs.com/package/lodash.thorttle)                     | Single utility function from [Lodash](https://www.npmjs.com/package/lodash).                  |
| [next](https://www.npmjs.com/package/next)                                           | Rendering framework for [React](https://www.npmjs.com/package/react).                         |
| [next-offline](https://www.npmjs.com/package/next-offline)                           | Offline support for [Next.js](https://www.npmjs.com/package/next).                            |
| [next-translate](https://www.npmjs.com/package/next-translate)                       | I18n support for [Next.js](https://www.npmjs.com/package/next).                               |
| [nprogress](https://www.npmjs.com/package/nprogress)                                 | Provides the loading bar.                                                                     |
| [ramda](https://www.npmjs.com/package/ramda)                                         | Our go-to utility library.                                                                    |
| [react](https://www.npmjs.com/package/react)                                         | Duh.                                                                                          |
| [react-dom](https://www.npmjs.com/package/react-dom)                                 | Duh.                                                                                          |
| [react-pdf](https://www.npmjs.com/package/react-pdf)                                 | Render PDF files.                                                                             |
| [remark-gfc](https://www.npmjs.com/package/remark-gfm)                               | Remark plugin to render additional Markdown elements.                                         |
| [yup](https://www.npmjs.com/package/yup)                                             | Object schema validation (used together with [Formik](https://www.npmjs.com/package/formik)). |

### Dev Requirements (excluding plugins and TypeScript typings)

| Dependency                                                                 | Reason                                                      |
| :------------------------------------------------------------------------- | :---------------------------------------------------------- |
| [@graphql-codegen/cli](https://www.npmjs.com/package/@graphql-codegen/cli) | Generate API functions from GraphQL code.                   |
| [dpdm](https://www.npmjs.com/package/dpdm)                                 | A tool that we use to check for circular dependencies.      |
| [cypress](https://www.npmjs.com/package/cypress)                           | Browser testing tool.                                       |
| [eslint](https://www.npmjs.com/package/eslint)                             | Linter.                                                     |
| [graphql-let](https://www.npmjs.com/package/graphql-let)                   | GraphQL Code Generator wrapper to automate code generation. |
| [prettier](https://www.npmjs.com/package/prettier)                         | Formatter.                                                  |
| [raw-loader](https://www.npmjs.com/package/raw-loader)                     | Needed for parsing Markdown files.                          |
| [typescript](https://www.npmjs.com/package/typescript)                     | Duh.                                                        |

## Debian Packages

| Dependency                                                        | Reason                         |
| :---------------------------------------------------------------- | :----------------------------- |
| [libgtk2.0-0](https://packages.debian.org/buster/libgtk2.0-0)     | Use Cypress for browser tests. |
| [libgtk-3-0](https://packages.debian.org/buster/libgtk-3-0)       | Use Cypress for browser tests. |
| [libnotify-dev](https://packages.debian.org/buster/libnotify-dev) | Use Cypress for browser tests. |
| [libgconf-2-4](https://packages.debian.org/buster/libgconf-2-4)   | Use Cypress for browser tests. |
| [libgbm-dev](https://packages.debian.org/buster/libgbm-dev)       | Use Cypress for browser tests. |
| [libxss3](https://packages.debian.org/buster/libxss3)             | Use Cypress for browser tests. |
| [libxss1](https://packages.debian.org/buster/libxss1)             | Use Cypress for browser tests. |
| [libasound2](https://packages.debian.org/buster/libasound2)       | Use Cypress for browser tests. |
| [libxtst6](https://packages.debian.org/buster/libxtst6)           | Use Cypress for browser tests. |
| [xauth](https://packages.debian.org/buster/xauth)                 | Use Cypress for browser tests. |
| [xvfb](https://packages.debian.org/buster/xvfb)                   | Use Cypress for browser tests. |

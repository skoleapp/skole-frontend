# Skole Frontend 🎓

[![ci](https://github.com/skoleapp/skole-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/skoleapp/skole-frontend/actions)
[![codecov](https://codecov.io/gh/skoleapp/skole-frontend/branch/develop/graph/badge.svg?token=MTHoRbYw89)](https://codecov.io/gh/skoleapp/skole-frontend)
[![typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label&color=007acc)](https://www.typescriptlang.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

This is the frontend for the Skole app.

Also check out the [README from `skole` repo](https://github.com/skoleapp/skole/blob/develop/README.md).

See detailed description for all top-level dependencies in [`dependencies.md`](dependencies.md) file.

Other useful documentation:

- [Next.js docs](https://nextjs.org/docs)
- [Material UI docs](https://material-ui.com)
- [React docs](https://reactjs.org/docs/getting-started.html)
- [Cypress docs](https://docs.cypress.io)

## What's inside? 🧐

A quick look at the top-level files and directories excluding Git ignored locations.

1.  [**`__generated__/`**](__generated__/): Generated code by [graphql-let](https://www.npmjs.com/package/graphql-let).
2.  [**`.github/`**](.github/): Configuration for [Github Actions](https://github.com/features/actions).
3.  [**`.idea/`**](.idea/): [Jetbrains](https://www.jetbrains.com) editor configuration.
4.  [**`.vscode/`**](.vscode/): [VSCode](https://code.visualstudio.com) configuration.
5.  [**`cypress/`**](cypress/): [Cypress](https://www.cypress.io) tests.
6.  [**`locales/`**](locales/): Contains JSON files with all of the translated UI strings.
7.  [**`markdown/`**](markdown/): Markdown content used in static pages.
8.  [**`public/`**](public/): Static assets exposed in the browser.
9.  [**`src/`**](src/): Source code.
10. [**`.babelrc`**](.babelrc): [Babel](https://babeljs.io) configuration.
11. [**`.dockerignore`**](.dockerignore): List of files ignored by [Docker](https://www.docker.com).
12. [**`.eslintignore`**](.eslintignore): List of files ignored by [ESLint](https://www.npmjs.com/package/eslint).
13. [**`.eslintrc.json`**](.eslintrc.json): ESLint configuration.
14. [**`.gitattributes`**](.gitattributes): Additional Git [repo metadata](https://git-scm.com/docs/gitattributes).
15. [**`.gitignore`**](.gitignore): List of files ignored by [Git](https://git-scm.com).
16. [**`.graphql-let.yml`**](.graphql-let.yml): Configuration for [graphql-let](https://www.npmjs.com/package/graphql-let).
17. [**`.graphqlconfig`**](.graphqlconfig): GraphQL configuration file, used by e.g. Jetbrains editors.
18. [**`.prettierignore`**](.prettierignore): List of files ignored by [Prettier](https://prettier.io).
19. [**`.prettierrc.json`**](.prettierrc.json): Prettier configuration.
20. [**`cypress.json`**](cypress.json): Cypress configuration.
21. [**`dependencies.md`**](dependencies.md): Documentation for top-level dependencies.
22. [**`Dockerfile`**](Dockerfile): Formal instructions for Docker how to build the image for the app.
23. [**`i18n.js`**](i18n.js): Configuration for [next-translate](https://www.npmjs.com/package/next-translate).
24. [**`next-env.d.ts`**](next-env.d.ts): [Next.js](https://nextjs.org/) typings for [TypeScript](https://www.typescriptlang.org) compiler.
25. [**`next.config.js`**](next.config.js): Next.js configuration.
26. [**`package.json`**](package.json): Manifest file for [Node.js](https://nodejs.org/en).
27. [**`README.md`**](README.md): The file you're reading.
28. [**`schema.graphql`**](schema.graphql): Dumped GraphQL schema (used by IDEA).
29. [**`tsconfig.json`**](tsconfig.json): TypeScript configuration.
30. [**`types.d.ts`**](types.d.ts): Module de[Next.js](https://nextjs.org) typings for [TypeScript](https://www.typescriptlang.org) compiler.larations for dependencies that do not have TypeScript typings.
31. [**`yarn.lock`**](yarn.lock): Auto-generated file for locking version numbers of all dependencies listed in `package.json`.

## Development Tips 🚀

- No pull requests can be merged without CI first building and running `Dockerfile` against it. See the bottommost `CMD` in the `Dockerfile` for the full list of stuff it runs and validates.
  CI also verifies the code style, so there is no need to argue about formatting.
- The code style is based on [Airbnb JavaScript Style Guide](https://airbnb.io/javascript/react/) with a few exceptions.
- Use functional components for everything.
- ESLint will show a warning for all `any`-typings. Use `unknown`-type instead or ignore the line if you absolutely have to.
- Comment all type ignores with a statement describing the reason for the ignore.
- Try to keep the JSX readable. In this project, we have tried to split up the JSX so that it _almost_ never exceeds 4 levels of depth.
- Place all global constants in `constants.ts` file. If the constant is related to theming/styles, you can place it in `theme.ts`.
- Place all global helper functions in `helpers.ts` file.
- Place all global hooks in the `hooks` folder in a file with the same name as the hook.
- Use named imports/exports for everything except most Material UI components. Always re-export functions that are inside a folder from an `index.ts` file.
- Whenever you add a new folder in the `src` directory, add it as an absolute path in the `tsconfig.json` file.
- Whenever you add a new file/folder in the root directory, please document it in the "What's inside?" section.
- Make sure your backend branch is up-to-date when running the GraphQL code gen as it validates the queries and mutations against the backend schemas.
- Use [Material UI](https://material-ui.com/) components instead of native HTML elements for consistency, e.g. [Box](https://material-ui.com/components/box/#box) vs `div` and [Typography](https://material-ui.com/components/typography/#typography) vs. `p`-tags.
- Use React Context API for all app-level state management. Use the `context`-folder as a reference. In short, we avoid using reducers for less boilerplate. Place the context provider as low as possible in the component tree.
- If an interface/type is used in more than one place, put it in the `types` folder in a suitable file. If the interface/type is only used in one place, you may define it in that file.
- If you have only one component per file, name the component prop interface/type as `Props`. Otherwise, if you have two components in a file, e.g. `Foo` and `Bar`, name the prop interfaces/types as `FooProps` and `BarProps`.
- Avoid using inline styles. In this project, we have used [CSS in JS](https://v1.material-ui.com/customization/css-in-js/) nearly everywhere with a few exceptions.
- Document everything that is hard to understand from the code. Use single line comment syntax for everything, even for multi-line comments.
- Avoid writing event handlers/functions directly in JSX to keep it more readable.
- Use `React.FC` syntax for all components.
- Use [Material Icons](https://material.io/resources/icons/) for all icons. Make sure to use the outlined variants of the icons.
- Use `<></>` instead of `React.Fragment` for fragments.
- If you split up JSX to multiple variables, name them so that they start with the word "render", e.g `const renderFoo = ...`.
- TS doesn't play nice with React refs. Use non-null-assertions for refs, e.g. `const myRef = useRef(null!)`.
- Use ES6 syntax everywhere:
  - Avoid using the `function` keyword.
  - Use `async`/`await` syntax.
  - Destructure objects and imports whenever possible.
- Whenever you add a new page that Google should index, make sure to add that entry to the [`sitemap.xml.ts`](src/pages/sitemap.xml.ts) files `staticPaths` array.
- Whenever you add a new page that Google should not index, make sure to add that entry to the [`robots.txt.ts`](src/pages/robots.txt.ts) files `paths` array.
- Make sure not to update `@date-io/dayjs` beyond major version 1, later versions are currently not supported by MUI date pickers.
- For forms that use dynamic initial values, use the `enableReinitialize` prop together with the `useMemo` hook for the initial values.
- When settings `z-index` CSS values, document the use case so it's clear on which elements that value affects.
- Do not use `next/link`, use our custom `Link`-component instead to make sure anchor tags are always rendered properly.
- Generate Cypress fixtures easily by copying the request from `common.graphql` and using e.g. [Insomnia](https://insomnia.rest) to get the backend response as JSON.

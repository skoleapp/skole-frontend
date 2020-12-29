# Skole Frontend 🎓

[![circleci status](https://circleci.com/gh/skoleapp/skole-frontend.svg?style=shield&circle-token=e15c5fba3e4d8011364889043a709e2eaafccb2d)](https://circleci.com/gh/skoleapp/skole-frontend)
[![typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label&color=007acc)](https://www.typescriptlang.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

This is the frontend for the Skole app.

Also check out the [README from `skole` repo](https://github.com/skoleapp/skole/blob/develop/README.md).

See detailed description for all top-level dependencies in [`dependencies.md`](dependencies.md) file.

Other useful documentation:

-   [Next.js docs](https://nextjs.org/docs)
-   [Material UI docs](https://material-ui.com/)
-   [React docs](https://reactjs.org/docs/getting-started.html)

## What's inside? 🧐

A quick look at the top-level files and directories excluding Git ignored locations.

1.  [**`.circleci/`**](.circleci/): Configuration for [CircleCI](https://circleci.com/).
2.  [**`.github/`**](.github/): Configuration for [Github Actions](https://github.com/features/actions).
3.  [**`.idea/`**](.idea/): [Jetbrains](https://www.jetbrains.com/) editor configuration.
4.  [**`.vscode/`**](.vscode/): [VSCode](https://code.visualstudio.com/) configuration.
5.  [**`__generated__/`**](__generated__/): Generated code by [graphql-let](https://www.npmjs.com/package/graphql-let).
6.  [**`locales/`**](locales/): Contains JSON files with all of the translated UI strings.
7.  [**`public/`**](public/): Static assets exposed in the browser.
8.  [**`src/`**](src/): Source code.
9.  [**`.dockerignore`**](.dockerignore): List of files ignored by [Docker](https://www.docker.com/).
10.  [**`.eslintignore`**](.eslintignore): List of files ignored by [ESLint](https://www.npmjs.com/package/eslint).
11.  [**`.eslintrc.json`**](.eslintrc.json): ESLint configuration.
12. [**`.gitattributes`**](.gitattributes): Additional Git [repo metadata](https://git-scm.com/docs/gitattributes).
13. [**`.gitignore`**](.gitignore): List of files ignored by [Git](https://git-scm.com/).
14. [**`.graphql-let.yml`**](.graphql-let.yml): Configuration for [graphql-let](https://www.npmjs.com/package/graphql-let).
15. [**`.graphqlconfig`**](.graphqlconfig): GraphQL configuration file, used by e.g. Jetbrains editors.
16. [**`.prettierignore`**](.prettierignore): List of files ignored by [Prettier](https://prettier.io/).
17. [**`.prettierrc.json`**](.prettierrc.json): Prettier configuration.
18. [**`Dockerfile`**](Dockerfile): Formal instructions for Docker how to build the image for the app.
19. [**`README.md`**](README.md): The file you're reading.
20. [**`dependencies.md`**](dependencies.md): Documentation for top-level dependencies.
21. [**`i18n.json`**](i18n.json): Configuration for [next-translate](https://www.npmjs.com/package/next-translate).
22. [**`next-env.d.ts`**](next-env.d.ts): [Next.js](https://nextjs.org/) typings for [TypeScript](https://www.typescriptlang.org/) compiler.
23. [**`next.config.js`**](next.config.js): Next.js configuration.
24. [**`package.json`**](package.json): Manifest file for [Node.js](https://nodejs.org/en/).
25. [**`tsconfig.json`**](tsconfig.json): TypeScript configuration.
26. [**`types.d.ts`**](types.d.ts): Module de[Next.js](https://nextjs.org/) typings for [TypeScript](https://www.typescriptlang.org/) compiler.larations for dependencies that do not have TypeScript typings.
27. [**`yarn.lock`**](yarn.lock): Auto-generated file for locking version numbers of all dependencies listed in `package.json`.

## Development Tips 🚀

-   No pull requests can be merged without CircleCI first building and running `Dockerfile` against it. See the bottommost `CMD` in the `Dockerfile` for the full list of stuff it runs and validates.
    CircleCI also verifies the code style, so there is no need to argue about formatting.
-   The code style is based on [Airbnb JavaScript Style Guide](https://airbnb.io/javascript/react/) with a few exceptions.
-   Use functional components for everything.
-   ESLint will show a warning for all `any`-typings. Use `unknown`-type instead or ignore the line if you absolutely have to.
-   Comment all type ignores with a statement describing the reason for the ignore.
-   Try to keep the JSX readable. In this project, we have tried to split up the JSX so that it _almost_ never exceeds 4 levels of depth.
-   Place all global constants in `constants.ts` file. If the constant is related to theming/styles, you can place it in `theme.ts`.
-   Place all global helper functions in `helpers.ts` file.
-   Place all global hooks in the `hooks` folder in a file with the same name as the hook.
-   Use named exports for everything. Always re-export functions that are inside a folder from an `index.ts` file.
-   Whenever you add a new folder in the `src` directory, add it as an absolute path in the `tsconfig.json` file.
-   Whenever you add a new file/folder in the root directory, please document it in the "What's inside?" section.
-   Make sure your backend branch is up-to-date when running the GraphQL code gen as it validates the queries and mutations against the backend schemas.
-   Use [Material UI](https://material-ui.com/) components instead of native HTML elements for consistency, e.g. [Box](https://material-ui.com/components/box/#box) vs `div` and [Typography](https://material-ui.com/components/typography/#typography) vs. `p`-tags.
-   Use React Context API for all app-level state management. Use the `context`-folder as a reference. In short, we avoid using reducers for less boilerplate. Place the context provider as low as possible in the component tree.
-   If an interface/type is used in more than one place, put it in the `types` folder in a suitable file. If the interface/type is only used in one place, you may define it in that file.
-   If you have only one component per file, name the component prop interface/type as `Props`. Otherwise, if you have two components in a file, e.g. `Foo` and `Bar`, name the prop interfaces/types as `FooProps` and `BarProps`.
-   Avoid using inline styles. In this project, we have used [CSS in JS](https://v1.material-ui.com/customization/css-in-js/) nearly everywhere with a few exceptions.
-   Document everything that is hard to understand from the code. Use single line comment syntax for everything, even for multi-line comments.
-   Avoid writing event handlers/functions directly in JSX to keep it more readable.
-   Use `React.FC` syntax for all components.
-   Use [Material Icons](https://material.io/resources/icons/) for all icons. Make sure to use the outlined variants of the icons.
-   Use `<></>` instead of `React.Fragment` for fragments.
-   If you split up JSX to multiple variables, name them so that they start with the word "render", e.g `const renderFoo = ...`.
-   TS doesn't play nice with React refs. Use non-null-assertions for refs, e.g. `const myRef = useRef(null!)`.
-   Use ES6 syntax everywhere:
    -   Avoid using the `function` keyword.
    -   Use `async`/`await` syntax.
    -   Destructure objects and imports whenever possible.
- Whenever you add a new page that Google should index, make sure to add that entry to the [`sitemap.xml.ts`](src/pages/sitemap.xml.ts) files `staticPaths` array.
- Whenever you add a new page that Google should not index, make sure to add that entry to the [`robots.txt.ts`](src/pages/robots.txt.ts) files `paths` array.

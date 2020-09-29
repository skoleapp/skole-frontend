# Skole Frontend 🎓

This is the frontend for the Skole app.

Also check out the [README from `skole` repo](https://github.com/ruohola/skole/blob/develop/README.md).

See detailed description for all top-level dependencies in `dependencies.md` file.

Other useful documentation:

-   [Next.js docs](https://nextjs.org/docs)
-   [Material UI docs](https://material-ui.com/)
-   [React docs](https://reactjs.org/docs/getting-started.html)

## What's inside? 🧐

A quick look at the top-level files and directories excluding `node_modules` and other built locations.

    .
    ├── .circleci
    ├── .idea
    ├── .vscode
    ├── generated
    ├── public
    ├── src
    ├── .dockerignore
    ├── .eslintignore
    ├── .eslintrc.js
    ├── .gitignore
    ├── .graphqlconfig
    ├── .prettierignore
    ├── .prettierrc
    ├── .codegen.yml
    ├── dependencies.md
    ├── Dockerfile
    ├── Dockerfile.prod
    ├── next-env.d.ts
    ├── next.config.js
    ├── package.json
    ├── README.json
    ├── tsconfig.json
    ├── types.d.ts
    └── yarn.lock

1.  **`/.circleci`**: CI/CD configuration for [CircleCI](https://circleci.com/).

2.  **`/.idea`**: [Jetbrains](https://www.jetbrains.com/) editor configuration.

3.  **`/.vscode`**: [VSCode](https://code.visualstudio.com/) configuration.

4.  **`/generated`**: Generated code by [GraphQL Code Generator](https://www.npmjs.com/package/@graphql-codegen).

5.  **`/public`**: Static assets exposed in the browser.

6.  **`/src`**: Source code.

7.  **`.dockerignore`**: List of files ignored by [Docker](https://www.docker.com/).

8.  **`.eslintignore`**: List of files ignored by [ESLint](https://www.npmjs.com/package/eslint).

9.  **`.eslintrc.js`**: ESLint configuration.

10. **`.gitignore`**: List of files ignored by [Git](https://git-scm.com/).

11. **`.graphqlconfig`**: GraphQL configuration file, used by e.g. Jetbrains editors.

12. **`.prettierignore`**: List of files ignored by [Prettier](https://prettier.io/).

13. **`.prettierrc.js`**: Prettier configuration.

14. **`codegen.yml`**: GraphQL Code Generator configuration.

15. **`dependencies`**: Documentation for top-level dependencies.

16. **`Dockerfile`**: Docker configuration for development.

17. **`Dockerfile.prod`**: Docker configuration for production.

18. **`next-env.d.ts`**: [Next.js](https://nextjs.org/) typings for [TypeScript](https://www.typescriptlang.org/) compiler.

19. **`next.config.js`**: Next.js configuration.

20. **`next.config.js`**: Next.js configuration.

21. **`package.json`**: Manifest file for [Node.js](https://nodejs.org/en/).

22. **`README.md`**: Text file containing useful reference information about this project.

23. **`tsconfig.json`**: TypeScript configuration.

24. **`types.d.ts`**: Module declarations for dependencies that do not have TypeScript typings.

25. **`yarn.lock`**: Auto-generated file for locking version numbers of all dependencies listed in `package.json`.

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
-   Use the `useTranslation` hook whenever you need component-level translations. We avoid using the `withTranslation` HOC for clearer namespace definition.
-   Document everything that is hard to understand from the code. Use single line comment syntax for everything, even for multi-line comments.
-   Avoid writing event handlers/functions directly in JSX to keep it more readable.
-   Use `React.FC` syntax for all components.
-   Use [Material Icons](https://material.io/resources/icons/) for all icons. Make sure to use the outlined variants of the icons.
-   Use ES6 syntax everywhere:
    -   Avoid using the `function` keyword.
    -   Use `async`/`await` syntax.
    -   Destructure objects and imports whenever possible.

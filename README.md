# Skole Frontend :mortar_board:

This is the frontend for the Skole app.

Also check out the [README from `skole` repo](https://github.com/ruohola/skole/blob/develop/README.md).

See detailed description for all top-level dependencies in `dependencies.md` file.

### Development Tips

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
-   Use ES6 syntax everywhere:
    -   Avoid using the `function` keyword.
    -   Use `async`/`await` syntax.
    -   Destructure objects and imports whenever possible.

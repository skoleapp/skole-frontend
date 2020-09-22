# Skole Frontend :mortar_board:

This is the frontend for the Skole app.

Also check out the [README from `skole` repo](https://github.com/ruohola/skole/blob/develop/README.md).

See detailed description for all top-level dependencies in `dependencies.md` file.

### Development Tips

- No pull requests can be merged without CircleCI first building and running `Dockerfile` against it.
  See the bottommost `CMD` in the `Dockerfile` for the full list of stuff it runs and validates.
  CircleCI also verifies the code style, so there is no need to argue about formatting.

- Use React Context API for all app-level state management. Use the `context`-folder as a reference. In short, we avoid using reducers for less boiler plate.

- The code style is based on [Airbnb JavaScript Style Guide](https://airbnb.io/javascript/react/) with a few exceptions.

- ESLint will show a warning for all `any`-typings. Use `unknown`-type instead or ignore the line if you absolutely have to.

- Comment all type ignores with a statement describing the reason for the ignore.

- If an interface/type is used in more than one place, put it in the `types` folder in a suitable file. If the interface/type is only used in one place, you may define it in that file.

- Try to keep the JSX readable. In this project, we have tried to split up the JSX so that it *almost* never exceeds 4 levels of depth.

- Avoid using inline styles. In this project, we have used [CSS in JS](https://v1.material-ui.com/customization/css-in-js/) nearly everywhere with a few exceptions.

- Use the `useTranslation` hook whenever you need component-level translations. We avoid using the `withTranslation` HOC for clearer namespace definition.

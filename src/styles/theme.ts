import { createMuiTheme } from '@material-ui/core';

import { breakpointsNum, colors } from '.';

export const theme = createMuiTheme({
    breakpoints: {
        values: {
            xs: breakpointsNum.XS,
            sm: breakpointsNum.SM,
            md: breakpointsNum.MD,
            lg: breakpointsNum.LG,
            xl: breakpointsNum.XL,
        },
    },
    palette: {
        common: {
            black: colors.black,
            white: colors.white,
        },
        primary: {
            main: colors.primary,
            light: colors.primaryLight,
            dark: colors.primaryDark,
            contrastText: colors.white,
        },
        secondary: {
            main: colors.secondary,
            light: colors.secondaryLight,
            dark: colors.secondaryDark,
            contrastText: colors.black,
        },
        error: {
            main: colors.error,
        },
        warning: {
            main: colors.warning,
        },
        info: {
            main: colors.info,
        },
        success: {
            main: colors.success,
        },
    },
    typography: {
        fontSize: 14,
        fontFamily: ['Roboto', 'sans-serif'].join(','),
    },
});

import { colors } from './colors';
import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: colors.primary,
        },
        secondary: {
            main: colors.secondary,
        },
    },
    typography: {
        fontSize: 14,
        fontFamily: ['Roboto', 'sans-serif'].join(','),
    },
});

import { createMuiTheme, responsiveFontSizes } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

const colors = {
    primary: '#ad3636',
    secondary: '#faf2de',
};

export const spacing = (factor: number): string => `${0.25 * factor}rem`;
export const borderRadius = '1.75rem';
export const border = `0.05rem solid ${grey[300]}`;

let theme = createMuiTheme({
    props: {
        MuiContainer: {
            maxWidth: 'xl',
        },
        MuiFormControl: {
            margin: 'dense',
            fullWidth: true,
            variant: 'outlined',
        },
        MuiTextField: {
            fullWidth: true,
            variant: 'outlined',
        },
        MuiSelect: {
            fullWidth: true,
            variant: 'outlined',
        },
    },
    overrides: {
        MuiButton: {
            root: {
                borderRadius,
            },
        },
        MuiLink: {
            root: {
                '&:hover': {
                    cursor: 'pointer',
                },
            },
        },
        MuiOutlinedInput: {
            root: {
                borderRadius,
            },
        },
        MuiList: {
            root: {
                padding: 0,
            },
        },
        MuiListItemAvatar: {
            root: {
                width: '2rem',
                height: '2rem',
            },
        },
        MuiSvgIcon: {
            root: {
                width: '1.35rem',
                height: '1.35rem',
            },
        },
        // MuiListItemText: {
        //     root: {
        //         display: "flex",
        //         alignItems: "center"
        //             .MuiSvgIcon-root {
        //                 margin-right: 0.5rem;
        //             }
        //     }
        // },
        MuiDrawer: {
            paperAnchorLeft: {
                minWidth: '20rem',
            },
        },
        MuiCssBaseline: {
            '@global': {
                '.main-avatar': {
                    height: '8rem',
                    width: '8rem',
                    margin: spacing(2),
                },
                '.avatar-thumbnail': {
                    height: '1.5rem',
                    width: '1.5rem',
                },
                '.truncate-text': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                },
                '.border-bottom': {
                    borderBottom: border,
                },
                // '.border-top': {
                //     borderTop: border,
                // },
                // "input[type='file']": {
                //     display: 'none',
                // },
                // '.custom-header': {
                //     height: '3rem',
                //     padding: spacing(2),
                //     borderBottom: border,
                // },
            },
        },
    },
    palette: {
        primary: {
            main: colors.primary,
        },
        secondary: {
            main: colors.secondary,
        },
    },
    typography: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
        h1: {
            fontSize: 50,
        },
    },
    spacing,
});

theme = responsiveFontSizes(theme);
export { theme };

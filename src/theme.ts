import { createMuiTheme, responsiveFontSizes } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import createPalette from '@material-ui/core/styles/createPalette';
import createTypography from '@material-ui/core/styles/createTypography';

// Global constants, feel free to use these where ever.
export const BORDER_RADIUS = '1.25rem';
export const BORDER = `0.05rem solid ${grey[300]}`;
export const BOTTOM_NAVBAR_HEIGHT = '3rem';
export const TOP_NAVBAR_HEIGHT_MOBILE = '3rem';
export const TOP_NAVBAR_HEIGHT_DESKTOP = '4rem';

export const COLORS = {
    primary: '#ad3636',
    secondary: '#faf2de',
    white: '#ffffff',
    black: '#000000',
    backgroundGrey: '#dbdbdb',
};

const breakpointOptions = {
    values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
    },
};

const paletteOptions = {
    primary: {
        main: COLORS.primary,
    },
    secondary: {
        main: COLORS.secondary,
    },
    common: {
        white: COLORS.white,
        black: COLORS.black,
    },
};

const typographyOptions = {
    fontFamily: ['Roboto', 'sans-serif'].join(','),
    h1: {
        fontSize: 50,
    },
};

const palette = createPalette(paletteOptions);
const typography = createTypography(palette, typographyOptions);
const spacing = (factor: number): string => `${0.25 * factor}rem`;
const breakpoints = createBreakpoints(breakpointOptions);

let theme = createMuiTheme({
    palette,
    typography,
    spacing,
    breakpoints,
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
            margin: 'normal',
        },
        MuiSelect: {
            fullWidth: true,
            variant: 'outlined',
            margin: 'none',
        },
        MuiTabs: {
            textColor: 'primary',
            variant: 'fullWidth',
            indicatorColor: 'primary',
        },
    },
    overrides: {
        MuiButton: {
            root: {
                borderRadius: BORDER_RADIUS,
                padding: spacing(3),
            },
            outlined: {
                padding: spacing(3),
            },
            text: {
                padding: spacing(3),
            },
        },
        MuiIconButton: {
            root: {
                padding: spacing(4),
            },
            sizeSmall: {
                padding: spacing(2.25),
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
                // FIXME: The border radius causes the shrinked label to get overlapped by the input outlines on Safari.
                // This is an issue with MUI: https://github.com/mui-org/material-ui/issues/13297
                borderRadius: BORDER_RADIUS,
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
        MuiCard: {
            root: {
                borderRadius: BORDER_RADIUS,
            },
        },
        MuiDrawer: {
            paperAnchorLeft: {
                minWidth: '20rem',
            },
            paperAnchorBottom: {
                borderRadius: `${BORDER_RADIUS} ${BORDER_RADIUS} 0 0`,
                paddingBottom: 'env(safe-area-inset-bottom)',
            },
        },
        MuiBottomNavigation: {
            root: {
                width: '100%',
                position: 'fixed',
                bottom: 0,
                borderTop: BORDER,
                height: `calc(env(safe-area-inset-bottom) + ${BOTTOM_NAVBAR_HEIGHT})`,
                display: 'flex',
                paddingBottom: 'env(safe-area-inset-bottom)',
            },
        },
        MuiBottomNavigationAction: {
            root: {
                minWidth: 0,
                padding: spacing(1),
                '&.Mui-selected': {
                    padding: spacing(1),
                },
            },
            label: {
                marginTop: spacing(0.25),
                '&.Mui-selected': {
                    fontSize: '0.75rem',
                },
            },
        },
        MuiTab: {
            root: {
                borderBottom: BORDER,
            },
        },
        MuiTable: {
            root: {
                display: 'flex',
                backgroundColor: COLORS.white,
                flexGrow: 1,
                position: 'relative',
            },
        },
        MuiTableContainer: {
            root: {
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                height: '100%',
                overflowY: 'auto',
            },
        },
        MuiTableBody: {
            root: {
                // TODO: See if this works in production.
                [breakpoints.up('md')]: {
                    overflowY: 'auto',
                },
            },
        },
        MuiTableRow: {
            root: {
                width: '100%',
                display: 'flex',
            },
        },
        MuiTableCell: {
            root: {
                flexGrow: 1,
                padding: spacing(2),
                borderBottom: 'none',
            },
        },
        MuiTableFooter: {
            root: {
                marginTop: 'auto',
            },
        },
        MuiTablePagination: {
            input: {
                margin: 0,
            },
        },
        MuiCardHeader: {
            root: {
                padding: `${spacing(2)} ${spacing(4)}`,
                textAlign: 'center',
            },
            title: {
                fontSize: '1.5rem',
            },
            action: {
                marginTop: 0,
                alignSelf: 'center',
            },
        },
        MuiDialogTitle: {
            root: {
                padding: spacing(2),
            },
        },
        MuiDialogContent: {
            root: {
                padding: spacing(2),
            },
        },
        MuiDialog: {
            paper: {
                overflow: 'hidden',
            },
        },
        MuiCssBaseline: {
            '@global': {
                body: {
                    backgroundColor: COLORS.secondary,
                    height: '100vh',
                    overflow: 'hidden',
                },
                '.avatar-thumbnail': {
                    height: '1.35rem !important',
                    width: '1.35rem !important',
                    padding: spacing(0.25),
                    margin: spacing(0.25),
                },
                '.truncate-text': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                },
                "input[type='file']": {
                    display: 'none',
                },
                "input[type='submit']": {
                    display: 'none',
                },
                '.react-swipeable-view-container': {
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    willChange: 'auto !important', // Fix overflow issues with border radiuses.
                    '& > div': {
                        display: 'flex',
                    },
                },
                '.screenshot-border': {
                    border: `0.05rem dashed ${COLORS.black}`,
                },
                '#nprogress': {
                    '& .bar': {
                        height: '0.25rem',
                        zIndex: 1101,
                        top: 'env(safe-area-inset-top)',
                    },
                    '& .peg': {
                        boxShadow: 'none',
                        transform: 'none',
                    },
                },
            },
        },
    },
});

theme = responsiveFontSizes(theme);

export { theme };

import { createMuiTheme, responsiveFontSizes } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

const colors = {
    primary: '#ad3636',
    secondary: '#faf2de',
    white: '#ffffff',
    black: '#000000',
};

const spacing = (factor: number): string => `${0.25 * factor}rem`;
export const BORDER_RADIUS = '1.75rem';
export const BORDER = `0.05rem solid ${grey[300]}`;
export const BOTTOM_NAVBAR_HEIGHT = '3rem';
export const TOP_NAVBAR_HEIGHT_MOBILE = '3rem';
export const TOP_NAVBAR_HEIGHT_DESKTOP = '4rem';

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
                padding: spacing(2),
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
                width: '1.25rem',
                height: '1.25rem',
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
                backgroundColor: colors.white,
                flexGrow: 1,
            },
        },
        MuiTableContainer: {
            root: {
                display: 'flex',
                flexDirection: 'column',
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
        MuiCardHeader: {
            root: {
                padding: `${spacing(2)} ${spacing(4)}`,
                textAlign: 'center',
            },
            title: {
                fontSize: '1.25rem',
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
    },
    palette: {
        primary: {
            main: colors.primary,
        },
        secondary: {
            main: colors.secondary,
        },
        common: {
            white: colors.white,
            black: colors.black,
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

// Globals and overrides that require media queries.
theme.overrides = {
    ...theme.overrides,
    MuiDialog: {
        paper: {
            overflow: 'hidden',
            [theme.breakpoints.up('lg')]: {
                borderRadius: BORDER_RADIUS,
            },
        },
    },
    MuiCssBaseline: {
        '@global': {
            body: {
                backgroundColor: theme.palette.secondary.main,
            },
            '.main-avatar': {
                height: '6rem',
                width: '6rem',
                margin: spacing(2),
            },
            '.avatar-thumbnail': {
                height: '1.35rem',
                width: '1.35rem',
                padding: spacing(0.25),
                margin: spacing(0.25),
            },
            '.truncate-text': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            },
            '.border-bottom': {
                borderBottom: BORDER,
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
                '& > div': {
                    display: 'flex',
                },
            },
            '.table-action-area': {
                display: 'flex',
            },
            '.main-background': {
                position: 'absolute',
                width: '100%',
                height: '100%',
                background:
                    'linear-gradient(rgba(255, 42, 0, 0.55), rgba(255, 42, 0, 0.55)), url(images/background.jpg)',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            },
            '.text-center': {
                textAlign: 'center',
            },
            '.text-left': {
                textAlign: 'left',
            },
            '.paper-container': {
                overflow: 'hidden',
                [theme.breakpoints.up('lg')]: {
                    borderRadius: BORDER_RADIUS,
                },
            },
            '.screenshot-border': {
                border: `0.05rem dashed ${colors.black}`,
            },
        },
    },
};

theme = responsiveFontSizes(theme);

export { theme };

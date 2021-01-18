import { grey } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints'; // eslint-disable-line no-restricted-imports
import createPalette from '@material-ui/core/styles/createPalette'; // eslint-disable-line no-restricted-imports
import createTypography, { TypographyOptions } from '@material-ui/core/styles/createTypography'; // eslint-disable-line no-restricted-imports

// Global constants, feel free to use these where ever.
export const BORDER_RADIUS = '1.75rem';
export const BORDER = `0.05rem solid ${grey[300]}`;
export const BOTTOM_NAVBAR_HEIGHT = '3.25rem';
export const TOP_NAVBAR_HEIGHT_MOBILE = '3.25rem';
export const TOP_NAVBAR_HEIGHT_DESKTOP = '4rem';

export const COLORS = {
  primary: '#ad3636',
  secondary: '#faf2de',
  white: '#ffffff',
  black: '#000000',
};

const breakpointOptions = {
  values: {
    xs: 350,
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

const typographyOptions: TypographyOptions = {
  fontFamily: ['Roboto', 'sans-serif'].join(','),
};

const palette = createPalette(paletteOptions);
const typography = createTypography(palette, typographyOptions);
const spacing = (factor: number): string => `${0.25 * factor}rem`;
const breakpoints = createBreakpoints(breakpointOptions);

export const theme = createMuiTheme({
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
      inputProps: {
        autoCapitalize: 'off',
        autoComplete: 'off',
      },
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
    MuiList: {
      disablePadding: true,
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
        borderRadius: BORDER_RADIUS,
      },
      adornedEnd: {
        paddingRight: spacing(1),
      },
    },
    MuiInputLabel: {
      // This fixes the buggy label on Safari: https://github.com/mui-org/material-ui/issues/20391
      shrink: {
        paddingLeft: spacing(1),
        paddingRight: spacing(1),
        backgroundColor: palette.common.white,
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
    MuiCardContent: {
      root: {
        padding: `${spacing(4)} !important`,
      },
    },
    MuiDrawer: {
      paperAnchorBottom: {
        borderRadius: `${BORDER_RADIUS} ${BORDER_RADIUS} 0 0`,
        paddingBottom: 'env(safe-area-inset-bottom)',
        marginRight: 'env(safe-area-inset-right)',
        marginLeft: 'env(safe-area-inset-left)',
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
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        zIndex: 1,
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
    MuiTableContainer: {
      root: {
        display: 'flex',
        backgroundColor: COLORS.white,
        flexGrow: 1,
        position: 'relative',
        overflow: 'hidden',
      },
    },
    MuiTable: {
      root: {
        display: 'flex',
        flexDirection: 'column',
      },
    },
    MuiTableBody: {
      root: {
        flexGrow: 1,
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
        [breakpoints.up('md')]: {
          borderTop: BORDER,
        },
      },
    },
    MuiTablePagination: {
      input: {
        margin: 0,
      },
    },
    MuiCardHeader: {
      root: {
        padding: spacing(2),
        textAlign: 'center',
      },
      title: {
        fontSize: '1.35rem',
      },
      action: {
        margin: '0 !important',
      },
    },
    MuiDialog: {
      container: {
        paddingTop: 'env(safe-area-inset-top)',
      },
      paper: {
        overflow: 'hidden',
        paddingRight: 'env(safe-area-inset-right)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        margin: spacing(4),
      },
    },
    MuiDialogTitle: {
      root: {
        padding: spacing(2),
      },
    },
    MuiAppBar: {
      root: {
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        paddingTop: 'env(safe-area-inset-top)',
      },
    },
    MuiTabs: {
      root: {
        height: TOP_NAVBAR_HEIGHT_MOBILE,
      },
      flexContainer: {
        height: '100%',
      },
    },
    MuiCssBaseline: {
      '@global': {
        html: {
          webkitTextSizeAdjust: '100%', // https://github.com/mui-org/material-ui/issues/22423#issuecomment-683391113.
        },
        body: {
          backgroundColor: COLORS.secondary,
          [breakpoints.down('md')]: {
            userSelect: 'none',
          },
        },
        '.avatar-thumbnail': {
          height: '1.35rem !important',
          width: '1.35rem !important',
          padding: spacing(0.25),
          margin: spacing(0.25),
          borderStyle: 'solid',
          borderWidth: 'thin',
          borderColor: 'secondary',
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
        '.MuiPickersModal-dialogRoot': {
          borderRadius: BORDER_RADIUS,
        },
        '.MuiPickersToolbarButton-toolbarBtn': {
          borderRadius: 0,
        },
        '.MuiPickersCalendarHeader-switchHeader': {
          margin: 0,
          padding: spacing(4),
        },
        '.MuiPickersToolbar-toolbar': {
          padding: `${spacing(4)} !important`,
          position: 'static !important' as 'static',
        },
      },
    },
  },
});

import { createMuiTheme, Theme } from '@material-ui/core/styles';
import createBreakpoints, { BreakpointsOptions } from '@material-ui/core/styles/createBreakpoints'; // eslint-disable-line no-restricted-imports
import createPalette, { PaletteOptions } from '@material-ui/core/styles/createPalette'; // eslint-disable-line no-restricted-imports
import { TypographyOptions } from '@material-ui/core/styles/createTypography'; // eslint-disable-line no-restricted-imports
import { Overrides } from '@material-ui/core/styles/overrides'; // eslint-disable-line no-restricted-imports
import { ComponentsProps } from '@material-ui/core/styles/props'; // eslint-disable-line no-restricted-imports
import { useDarkModeContext } from 'context';
import { useMemo } from 'react';
import {
  BORDER,
  BORDER_RADIUS,
  BOTTOM_NAVBAR_HEIGHT,
  COLORS,
  TOP_NAVBAR_HEIGHT_MOBILE,
} from 'styles';

export const useMuiTheme = (): Theme => {
  const { darkMode, dynamicPrimaryColor } = useDarkModeContext();

  const palette: PaletteOptions = {
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
    type: darkMode ? 'dark' : 'light',
  };

  const spacing = (factor: number): string => `${0.25 * factor}rem`;

  const typography: TypographyOptions = {
    fontFamily: ['Rubik', 'sans-serif'].join(','),
  };

  const breakpoints: BreakpointsOptions = {
    values: {
      xs: 350,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  };

  const _palette = createPalette(palette);
  const _breakpoints = createBreakpoints(breakpoints);

  const props: ComponentsProps = {
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
      textColor: dynamicPrimaryColor,
      variant: 'fullWidth',
      indicatorColor: dynamicPrimaryColor,
    },
    MuiList: {
      disablePadding: true,
    },
    MuiCheckbox: {
      color: dynamicPrimaryColor,
    },
    MuiSwitch: {
      color: dynamicPrimaryColor,
    },
    MuiLink: {
      color: dynamicPrimaryColor,
    },
    MuiCircularProgress: {
      color: dynamicPrimaryColor,
      disableShrink: true,
    },
    MuiBadge: {
      color: dynamicPrimaryColor,
    },
    MuiRadio: {
      color: dynamicPrimaryColor,
    },
    MuiButton: {
      color: dynamicPrimaryColor,
    },
  };

  // Only use with overrides.
  const _dynamicPrimaryColor =
    _palette.type === 'dark' ? _palette.secondary.main : _palette.primary.main;

  const overrides: Overrides = {
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
        backgroundColor: _palette.background.paper,
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
        zIndex: 2, // Overlap form labels.
      },
    },
    MuiBottomNavigationAction: {
      root: {
        minWidth: 0,
        padding: spacing(1),
        '&.Mui-selected': {
          padding: spacing(1),
          color: _dynamicPrimaryColor,
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
        // backgroundColor: COLORS.white,
        flexGrow: 1,
        position: 'relative',
        overflow: 'hidden !important',
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
        [_breakpoints.up('md')]: {
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
        fontSize: '1.25rem',
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
        zIndex: 2, // Overlap form labels.
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
    MuiAvatar: {
      root: {
        '& img': {
          borderRadius: '50%',
        },
      },
    },
    MuiStepIcon: {
      completed: {
        color: `${_palette.success.main} !important`,
      },
    },
    MuiFormLabel: {
      root: {
        zIndex: 1, // Underlap top and bottom navbars.
      },
    },
    MuiCssBaseline: {
      '@global': {
        html: {
          '-webkit-text-size-adjust': '100%', // https://github.com/mui-org/material-ui/issues/22423#issuecomment-683391113.
        },
        body: {
          backgroundColor: COLORS.secondary,
          [_breakpoints.down('md')]: {
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
            zIndex: 3, // Overlap top navbar.
            top: 'env(safe-area-inset-top)',
          },
          '& .peg': {
            boxShadow: 'none',
            transform: 'none',
          },
        },
        '.MuiPickersModal-dialogRoot': {
          borderRadius: `${BORDER_RADIUS} !important`,
          '& .MuiPickersToolbarButton-toolbarBtn': {
            borderRadius: '0.25rem !important',
          },
          '& .MuiPickersCalendarHeader-switchHeader': {
            margin: '0 !important',
            padding: spacing(4),
          },
          '& .MuiPickersToolbar-toolbar': {
            padding: `${spacing(4)} !important`,
            position: 'static !important' as 'static',
          },
          '& .MuiPickersModal-withAdditionalAction': {
            '& .MuiButtonBase-root': {
              color: _dynamicPrimaryColor,
            },
          },
        },
        '.form-text': {
          // Use consistent margins with form helper texts.
          marginLeft: '14px !important',
          marginRight: '14px !important',
        },
        '.rank-chip': {
          cursor: 'pointer !important',
        },
      },
    },
  };

  return useMemo(
    () =>
      createMuiTheme({
        palette,
        typography,
        spacing,
        breakpoints,
        props,
        overrides,
      }),
    [darkMode],
  );
};

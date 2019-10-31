import { createMuiTheme } from '@material-ui/core';
import { colors } from './colors';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.primary
    },
    secondary: {
      main: colors.white
    }
  },
  typography: {
    fontSize: 14
  }
});

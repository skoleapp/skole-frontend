import '@fontsource/rubik';

import { grey } from '@material-ui/core/colors';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

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

interface UseMediaQueries {
  smDown: boolean;
  mdUp: boolean;
}

export const useMediaQueries = (): UseMediaQueries => {
  const { breakpoints } = useTheme();
  const smDown = useMediaQuery(breakpoints.down('sm'));

  return {
    smDown,
    mdUp: !smDown,
  };
};

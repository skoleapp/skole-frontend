import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

interface UseMediaQueries {
  smDown: boolean;
  smUp: boolean;
  mdDown: boolean;
  mdUp: boolean;
  lgUp: boolean;
}

export const useMediaQueries = (): UseMediaQueries => {
  const { breakpoints } = useTheme();
  const smDown = useMediaQuery(breakpoints.down('sm'));
  const smUp = useMediaQuery(breakpoints.up('sm'));
  const mdDown = useMediaQuery(breakpoints.down('md'));
  const mdUp = useMediaQuery(breakpoints.up('md'));
  const lgUp = useMediaQuery(breakpoints.up('lg'));

  return {
    smDown,
    smUp,
    mdDown,
    mdUp,
    lgUp,
  };
};

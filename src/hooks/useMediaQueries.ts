import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

interface UseMediaQueries {
  isMobile: boolean;
  isMobileOrTablet: boolean;
  isTabletOrDesktop: boolean;
  isDesktop: boolean;
}

export const useMediaQueries = (): UseMediaQueries => {
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('sm'));
  const isMobileOrTablet = useMediaQuery(breakpoints.down('md'));

  return {
    isMobile,
    isMobileOrTablet,
    isTabletOrDesktop: !isMobile,
    isDesktop: !isMobileOrTablet,
  };
};

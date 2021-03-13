import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

interface UseMediaQueries {
  isXsMobile: boolean;
  isMobile: boolean;
  isMobileOrTablet: boolean;
  isTabletOrDesktop: boolean;
  isDesktop: boolean;
  isXlDesktop: boolean;
}

export const useMediaQueries = (): UseMediaQueries => {
  const { breakpoints } = useTheme();
  const isXsMobile = useMediaQuery(breakpoints.down('xs'));
  const isMobile = useMediaQuery(breakpoints.down('sm'));
  const isMobileOrTablet = useMediaQuery(breakpoints.down('md'));
  const isDesktop = useMediaQuery(breakpoints.up('lg'));
  const isXlDesktop = useMediaQuery(breakpoints.up('xl'));

  return {
    isXsMobile,
    isMobile,
    isMobileOrTablet,
    isTabletOrDesktop: (!isMobile && isMobileOrTablet) || isDesktop,
    isDesktop,
    isXlDesktop,
  };
};

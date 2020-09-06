import { useMediaQuery, useTheme } from '@material-ui/core';

interface UseMediaQueries {
    isMobile: boolean;
    isMobileOrTablet: boolean;
    isDesktop: boolean;
}

export const useMediaQueries = (): UseMediaQueries => {
    const { breakpoints } = useTheme();
    const isMobile = useMediaQuery(breakpoints.down('sm'));
    const isMobileOrTablet = useMediaQuery(breakpoints.down('md'));
    return { isMobile, isMobileOrTablet, isDesktop: !isMobileOrTablet };
};

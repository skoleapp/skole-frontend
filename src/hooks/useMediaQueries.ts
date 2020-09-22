import { useMediaQuery, useTheme } from '@material-ui/core';

interface UseMediaQueries {
    isMobile: boolean;
    isMobileOrTablet: boolean;
    isDesktop: boolean;
}

// Having the `isDesktop` query in addition to it's exact complement `isMobileOrTablet`
// is only for readability (isDesktop vs. !isMobileOrTablet). So feel free to use which ever of those.
export const useMediaQueries = (): UseMediaQueries => {
    const { breakpoints } = useTheme();
    const isMobile = useMediaQuery(breakpoints.down('sm'));
    const isMobileOrTablet = useMediaQuery(breakpoints.down('md'));
    return { isMobile, isMobileOrTablet, isDesktop: !isMobileOrTablet };
};

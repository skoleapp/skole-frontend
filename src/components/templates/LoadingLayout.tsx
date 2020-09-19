import { Box, makeStyles } from '@material-ui/core';
import React from 'react';
import { MainLayoutProps } from 'types';

import { LoadingBox } from '..';
import { MainLayout } from './MainLayout';

const useStyles = makeStyles(({ palette }) => ({
    root: {
        flexGrow: 1,
        backgroundColor: palette.common.white,
        display: 'flex',
        alignItems: 'center',
    },
}));

export const LoadingLayout: React.FC<Pick<MainLayoutProps, 'seoProps'>> = ({ seoProps }) => {
    const classes = useStyles();

    const layoutProps = {
        seoProps,
        disableBottomNavbar: true,
        disableFooter: true,
        topNavbarProps: {
            disableAuthButtons: true,
            disableLogo: true,
            disableSearch: true,
        },
        containerProps: {
            fullWidth: true,
            dense: true,
        },
    };

    return (
        <MainLayout {...layoutProps}>
            <Box className={classes.root}>
                <LoadingBox />
            </Box>
        </MainLayout>
    );
};

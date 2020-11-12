import { Box, makeStyles } from '@material-ui/core';
import React from 'react';

import { LoadingBox } from '../shared';
import { MainLayout } from './MainLayout';

const useStyles = makeStyles(({ palette }) => ({
    root: {
        flexGrow: 1,
        backgroundColor: palette.common.white,
        display: 'flex',
        alignItems: 'center',
    },
}));

export const LoadingLayout: React.FC = () => {
    const classes = useStyles();

    const layoutProps = {
        seoProps: {
            title: '',
            description: '',
        },
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

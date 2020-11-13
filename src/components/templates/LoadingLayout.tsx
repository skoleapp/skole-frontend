import { Box, makeStyles } from '@material-ui/core';
import Image from 'next/image';
import React from 'react';

import { MainLayout } from './MainLayout';

const useStyles = makeStyles(({ palette }) => ({
    root: {
        flexGrow: 1,
        backgroundColor: palette.secondary.main,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bounce: {
        animation: '$bounce 1s',
        animationIterationCount: 'infinite',
    },
    '@keyframes bounce': {
        '0%, 25%, 50%, 75%, 100%': {
            transform: 'translateY(0)',
        },
        '40%': {
            transform: 'translateY(-20px)',
        },
        '60%': {
            transform: 'translateY(-12px)',
        },
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
                <Image
                    height={120}
                    width={150}
                    className={classes.bounce}
                    src="/images/icons/skole-icon-text-red.svg"
                />
            </Box>
        </MainLayout>
    );
};

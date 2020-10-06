import { CardHeader, makeStyles, Paper } from '@material-ui/core';
import { useTranslation } from 'lib';
import React from 'react';
import { BORDER_RADIUS } from 'theme';
import { MainLayoutProps } from 'types';

import { NotFoundBox } from '../shared';
import { MainLayout } from './MainLayout';

const useStyles = makeStyles(({ breakpoints }) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        [breakpoints.up('lg')]: {
            borderRadius: BORDER_RADIUS,
        },
    },
}));

export const OfflineLayout: React.FC<Pick<MainLayoutProps, 'seoProps'>> = ({ seoProps }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const layoutProps = {
        seoProps,
        topNavbarProps: {
            dynamicBackUrl: true,
            disableAuthButtons: true,
        },
    };

    return (
        <MainLayout {...layoutProps}>
            <Paper className={classes.root}>
                <CardHeader title={t('common:offlineHeader')} />
                <NotFoundBox text={t('common:offlineText')} />
            </Paper>
        </MainLayout>
    );
};

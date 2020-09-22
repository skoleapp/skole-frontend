import { CardHeader, makeStyles, Paper } from '@material-ui/core';
import clsx from 'clsx';
import { useTranslation } from 'lib';
import React from 'react';
import { MainLayoutProps } from 'types';

import { NotFoundBox } from '../shared';
import { MainLayout } from './MainLayout';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
});

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
            <Paper className={clsx('paper-container', classes.root)}>
                <CardHeader title={t('common:offlineHeader')} />
                <NotFoundBox text={t('common:offlineText')} />
            </Paper>
        </MainLayout>
    );
};

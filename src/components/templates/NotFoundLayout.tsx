import { CardHeader, makeStyles, Paper } from '@material-ui/core';
import clsx from 'clsx';
import { useTranslation } from 'lib';
import React from 'react';

import { MainLayout } from './MainLayout';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

export const NotFoundLayout: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation();

    const layoutProps = {
        seoProps: {
            title: t('404:title'),
            description: t('404:description'),
        },
        topNavbarProps: {
            dynamicBackUrl: true,
            disableAuthButtons: true,
        },
    };

    return (
        <MainLayout {...layoutProps}>
            <Paper className={clsx('paper-container', classes.root)}>
                <CardHeader title={t('404:header')} />
            </Paper>
        </MainLayout>
    );
};

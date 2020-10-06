import { CardHeader, makeStyles, Paper } from '@material-ui/core';
import { useTranslation } from 'lib';
import React from 'react';
import { BORDER_RADIUS } from 'theme';
import { SEOProps } from 'types';

import { NotFoundBox } from '../shared';

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

import { MainLayout } from './MainLayout';

interface Props {
    seoProps?: SEOProps;
}

export const ErrorLayout: React.FC<Props> = ({ seoProps }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const defaultSeoProps = {
        title: t('_error:title'),
        description: t('_error:description'),
    };

    const layoutProps = {
        seoProps: seoProps || defaultSeoProps,
        topNavbarProps: {
            dynamicBackUrl: true,
            disableAuthButtons: true,
        },
    };

    return (
        <MainLayout {...layoutProps}>
            <Paper className={classes.root}>
                <CardHeader title={t('_error:header')} />
                <NotFoundBox text={t('_error:text')} />
            </Paper>
        </MainLayout>
    );
};

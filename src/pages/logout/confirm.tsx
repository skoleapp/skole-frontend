import { Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { ButtonLink, FormLayout } from 'components';
import { includeDefaultNamespaces, useTranslation, withAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { urls } from 'utils';

const ConfirmLogoutPage: NextPage = () => {
    const { t } = useTranslation();

    const layoutProps = {
        seoProps: {
            title: t('logout:title'),
            description: t('logout:description'),
        },
        header: t('logout:header'),
        topNavbarProps: {
            disableAuthButtons: true,
            disableSearch: true,
        },
    };

    return (
        <FormLayout {...layoutProps}>
            <Typography variant="subtitle1" align="center">
                {t('logout:confirmLogout')}
            </Typography>
            <Typography component="br" />
            <ButtonLink
                href={urls.logout}
                color="primary"
                variant="contained"
                endIcon={<ArrowForwardOutlined />}
                fullWidth
            >
                {t('common:confirm')}
            </ButtonLink>
        </FormLayout>
    );
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['logout']),
    },
});

export default withAuth(ConfirmLogoutPage);

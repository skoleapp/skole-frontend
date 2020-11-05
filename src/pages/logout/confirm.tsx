import { FormControl, Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { ButtonLink, FormLayout } from 'components';
import { loadNamespaces, useTranslation, withAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { urls } from 'utils';

const ConfirmLogoutPage: NextPage = () => {
    const { t } = useTranslation();
    const { query } = useRouter();

    const layoutProps = {
        seoProps: {
            title: t('confirm-logout:title'),
            description: t('confirm-logout:description'),
        },
        header: t('confirm-logout:header'),
        topNavbarProps: {
            disableAuthButtons: true,
            disableSearch: true,
        },
    };

    return (
        <FormLayout {...layoutProps}>
            <Typography variant="subtitle1" align="center">
                {t('confirm-logout:confirmLogout')}
            </Typography>
            <Typography component="br" />
            <ButtonLink
                href={{ pathname: urls.logout, query }}
                color="primary"
                variant="contained"
                endIcon={<ArrowForwardOutlined />}
                fullWidth
            >
                {t('common:confirm')}
            </ButtonLink>
            <FormControl>
                <ButtonLink href={urls.home} color="primary" variant="outlined" fullWidth>
                    {t('common:backToHome')}
                </ButtonLink>
            </FormControl>
        </FormLayout>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        _ns: await loadNamespaces(['confirm-logout'], locale),
    },
});

export default withAuth(ConfirmLogoutPage);

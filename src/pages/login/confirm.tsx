import { FormControl, Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { ButtonLink, FormLayout } from 'components';
import { useLanguageSelector } from 'hooks';
import { loadNamespaces, useTranslation, withNoAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { urls } from 'utils';

const ConfirmLoginPage: NextPage = () => {
    const { t } = useTranslation();
    const { query } = useRouter();
    const { renderLanguageButton } = useLanguageSelector();

    const layoutProps = {
        seoProps: {
            title: t('confirm-login:title'),
            description: t('confirm-login:description'),
        },
        header: t('confirm-login:header'),
        disableBottomNavbar: true,
        topNavbarProps: {
            headerRight: renderLanguageButton,
            disableAuthButtons: true,
            disableSearch: true,
        },
    };

    return (
        <FormLayout {...layoutProps}>
            <Typography variant="subtitle1" align="center">
                {t('confirm-login:confirmLogin')}
            </Typography>
            <Typography component="br" />
            <ButtonLink
                href={{ pathname: urls.login, query }}
                color="primary"
                variant="contained"
                endIcon={<ArrowForwardOutlined />}
                fullWidth
            >
                {t('common:continue')}
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
        _ns: await loadNamespaces(['confirm-login'], locale),
    },
});

export default withNoAuth(ConfirmLoginPage);

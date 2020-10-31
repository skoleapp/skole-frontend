import { FormControl, Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { ButtonLink, FormLayout } from 'components';
import { useLanguageSelector } from 'hooks';
import { useTranslation, withNoAuth } from 'lib';
import { NextPage } from 'next';
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
                {t('confirm:continue')}
            </ButtonLink>
            <FormControl>
                <ButtonLink href={urls.home} color="primary" variant="outlined" fullWidth>
                    {t('confirm-login:backToHome')}
                </ButtonLink>
            </FormControl>
        </FormLayout>
    );
};

export default withNoAuth(ConfirmLoginPage);

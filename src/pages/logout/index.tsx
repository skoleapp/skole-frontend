import { useApolloClient } from '@apollo/client';
import { FormControl, Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { ButtonLink, ErrorLayout, FormLayout, LoadingLayout, OfflineLayout } from 'components';
import { useNotificationsContext } from 'context';
import { GraphQlLogoutMutation, useGraphQlLogoutMutation } from 'generated';
import { useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation, withUserMe } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { urls } from 'utils';

const LogoutPage: NextPage = () => {
    const apolloClient = useApolloClient();
    const { t } = useTranslation();
    const { query } = useRouter();
    const { toggleNotification } = useNotificationsContext();
    const context = useLanguageHeaderContext();
    const onError = (): void => toggleNotification(t('notifications:logoutError'));

    const onCompleted = async ({ logout }: GraphQlLogoutMutation): Promise<void> => {
        if (!!logout && logout.deleted) {
            await apolloClient.clearStore();
            localStorage.setItem('logout', String(Date.now()));
            !!query.next && Router.push(String(query.next)); // Automatically redirect to the next page if one exists.
        }
    };

    const [logout, { loading, error }] = useGraphQlLogoutMutation({ onCompleted, onError, context });

    useEffect(() => {
        logout();
    }, []);

    const layoutProps = {
        seoProps: {
            title: t('logout:title'),
            description: t('logout:description'),
        },
        header: t('logout:header'),
        disableBottomNavbar: true,
        topNavbarProps: {
            disableAuthButtons: true,
            disableSearch: true,
        },
    };

    if (loading) {
        return <LoadingLayout />;
    }

    if (!!error && !!error.networkError) {
        return <OfflineLayout />;
    } else if (!!error) {
        return <ErrorLayout />;
    }

    return (
        <FormLayout {...layoutProps}>
            <Typography variant="subtitle1" align="center">
                {t('logout:loggedOut')}
            </Typography>
            <Typography component="br" />
            <ButtonLink
                href={urls.login}
                color="primary"
                variant="contained"
                endIcon={<ArrowForwardOutlined />}
                fullWidth
            >
                {t('logout:logInAgain')}
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
        _ns: await loadNamespaces(['logout'], locale),
    },
});

export default withUserMe(LogoutPage);

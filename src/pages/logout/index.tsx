import { useApolloClient } from '@apollo/client';
import { Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { ButtonLink, ErrorLayout, FormLayout, LoadingLayout, OfflineLayout } from 'components';
import { useNotificationsContext } from 'context';
import { BackendLogoutMutation, useBackendLogoutMutation } from 'generated';
import { includeDefaultNamespaces, useTranslation, withUserMe } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { AuthProps } from 'types';
import { urls } from 'utils';

const LogoutPage: NextPage<AuthProps> = ({ authLoading, authNetworkError }) => {
    const apolloClient = useApolloClient();
    const { t } = useTranslation();
    const { query } = useRouter();
    const { toggleNotification } = useNotificationsContext();
    const href = { pathname: urls.login, query };
    const onError = (): void => toggleNotification(t('notifications:logoutError'));

    const onCompleted = async ({ logout }: BackendLogoutMutation): Promise<void> => {
        if (!!logout && logout.deleted) {
            await apolloClient.clearStore();
            localStorage.setItem('logout', String(Date.now()));
        }
    };

    const [logout, { loading, error }] = useBackendLogoutMutation({ onCompleted, onError });

    useEffect(() => {
        logout();
    }, []);

    const seoProps = {
        title: t('logout:title'),
        description: t('logout:description'),
    };

    const layoutProps = {
        seoProps,
        header: t('logout:header'),
        disableBottomNavbar: true,
        topNavbarProps: {
            disableAuthButtons: true,
            disableSearch: true,
        },
    };

    if (authLoading || loading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    if ((!!error && !!error.networkError) || authNetworkError) {
        return <OfflineLayout seoProps={seoProps} />;
    } else if (!!error) {
        return <ErrorLayout seoProps={seoProps} />;
    }

    return (
        <FormLayout {...layoutProps}>
            <Typography variant="subtitle1" align="center">
                {t('logout:loggedOut')}
            </Typography>
            <Typography component="br" />
            <ButtonLink href={href} color="primary" variant="contained" endIcon={<ArrowForwardOutlined />} fullWidth>
                {t('logout:loginButton')}
            </ButtonLink>
        </FormLayout>
    );
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['logout']),
    },
});

export default withUserMe(LogoutPage);

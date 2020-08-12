import { useApolloClient } from '@apollo/client';
import { Box, Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { ButtonLink, ErrorLayout, FormLayout, LoadingLayout, OfflineLayout } from 'components';
import { useNotificationsContext } from 'context';
import { BackendLogoutMutation, useBackendLogoutMutation } from 'generated';
import { includeDefaultNamespaces, useTranslation, withUserMe } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import styled from 'styled-components';
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
            await apolloClient.resetStore();
            localStorage.setItem('logout', String(Date.now()));
        }
    };

    const [logout, { loading, error }] = useBackendLogoutMutation({ onCompleted, onError });

    useEffect(() => {
        logout();
    }, []);

    const renderLoggedOut = (
        <Box marginTop="1rem">
            <Typography variant="subtitle1">{t('logout:loggedOut')}</Typography>
            <Box marginTop="1rem">
                <ButtonLink
                    href={href}
                    color="primary"
                    variant="contained"
                    endIcon={<ArrowForwardOutlined />}
                    fullWidth
                >
                    {t('logout:loginButton')}
                </ButtonLink>
            </Box>
        </Box>
    );

    const seoProps = {
        title: t('logout:title'),
        description: t('logout:description'),
    };

    const layoutProps = {
        seoProps,
        desktopHeader: t('logout:header'),
        renderCardContent: renderLoggedOut,
        disableBottomNavbar: true,
        topNavbarProps: {
            disableAuthButtons: true,
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
        <StyledLogoutPage loading={loading}>
            <FormLayout {...layoutProps} />
        </StyledLogoutPage>
    );
};

// Ignore: loading must be omitted from Box props.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledLogoutPage = styled(({ loading, ...props }) => <Box {...props} />)`
    .MuiCard-root {
        display: flex;

        .MuiGrid-root {
            flex-grow: 1;

            // We only want to center the loading screen;
            align-items: ${({ loading }): string => (loading ? 'center' : 'inherit')};
        }
    }
`;

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['logout']),
    },
});

export default withUserMe(LogoutPage);

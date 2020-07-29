import { useApolloClient } from '@apollo/client';
import { Box, Typography } from '@material-ui/core';
import { HowToRegOutlined } from '@material-ui/icons';
import { ButtonLink, FormLayout, LoadingBox } from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { BackendLogoutMutation, useBackendLogoutMutation } from 'generated';
import { includeDefaultNamespaces, withUserAgent, withUserMe } from 'lib';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { urls } from 'utils';

const LogoutPage: NextPage = () => {
    const apolloClient = useApolloClient();
    const { userMe, setUserMe } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const { query } = useRouter();
    const { toggleNotification } = useNotificationsContext();
    const href = { pathname: urls.login, query };
    const onError = (): void => toggleNotification(t('notifications:logoutError'));

    const onCompleted = async ({ logout }: BackendLogoutMutation): Promise<void> => {
        if (!!logout && logout.deleted) {
            await apolloClient.resetStore();
            setUserMe(null);
        }
    };

    const [logout] = useBackendLogoutMutation({ onCompleted, onError });

    useEffect(() => {
        if (!!userMe) {
            (async (): Promise<void> => {
                setLoading(true);
                logout();
                setLoading(false);
            })();
        }
    }, []);

    const renderLoggingOut = <LoadingBox text={t('logout:loggingOut')} />;

    const renderLoggedOut = (
        <Box marginTop="1rem">
            <Typography variant="subtitle1">{t('logout:loggedOut')}</Typography>
            <Box marginTop="1rem">
                <ButtonLink href={href} color="primary" variant="contained" endIcon={<HowToRegOutlined />}>
                    {t('logout:loginButton')}
                </ButtonLink>
            </Box>
        </Box>
    );

    const layoutProps = {
        seoProps: {
            title: t('logout:title'),
            description: t('logout:description'),
        },
        desktopHeader: t('logout:header'),
        renderCardContent: loading ? renderLoggingOut : renderLoggedOut,
        disableBottomNavbar: true,
    };

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

const wrappers = R.compose(withUserAgent, withUserMe);

export const getServerSideProps: GetServerSideProps = wrappers(async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['logout']),
    },
}));

export default LogoutPage;

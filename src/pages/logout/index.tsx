import { useApolloClient } from '@apollo/react-hooks';
import { Box, Typography } from '@material-ui/core';
import { HowToRegOutlined } from '@material-ui/icons';
import { ButtonLink, FormLayout, LoadingBox } from 'components';
import { useAuthContext } from 'context';
import { includeDefaultNamespaces } from 'i18n';
import { withUserAgent, withUserMe } from 'lib';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { urls } from 'utils';

const LogoutPage: NextPage = () => {
    const apolloClient = useApolloClient();
    const { userMe, setUserMe } = useAuthContext();
    const { t } = useTranslation();
    const { query } = useRouter();
    const href = { pathname: urls.login, query };

    const handleLogout = async (): Promise<void> => {
        await apolloClient.resetStore();
        setUserMe(null);
    };

    useEffect(() => {
        handleLogout();
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
        renderCardContent: !!userMe ? renderLoggingOut : renderLoggedOut,
        disableBottomNavbar: true,
    };

    return <FormLayout {...layoutProps} />;
};

const wrappers = R.compose(withUserAgent, withUserMe);

export const getServerSideProps: GetServerSideProps = wrappers(async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['logout']),
    },
}));

export default LogoutPage;

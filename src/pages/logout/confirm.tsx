import { Box, Typography } from '@material-ui/core';
import { ExitToAppOutlined } from '@material-ui/icons';
import { ButtonLink, FormLayout } from 'components';
import { includeDefaultNamespaces, useTranslation, withUserAgent, withUserMe } from 'lib';
import { GetServerSideProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { urls } from 'utils';

const ConfirmLogoutPage: NextPage = () => {
    const { t } = useTranslation();

    const renderCardContent = (
        <Box marginTop="1rem">
            <Typography variant="subtitle1">{t('logout:confirmLogout')}</Typography>
            <Box marginTop="1rem">
                <ButtonLink href={urls.logout} color="primary" variant="contained" endIcon={<ExitToAppOutlined />}>
                    {t('common:confirm')}
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
        renderCardContent,
    };

    return <FormLayout {...layoutProps} />;
};

const wrappers = R.compose(withUserAgent, withUserMe);

export const getServerSideProps: GetServerSideProps = wrappers(async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['logout']),
    },
}));

export default ConfirmLogoutPage;

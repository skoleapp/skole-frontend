import { Box, Typography } from '@material-ui/core';
import { ExitToAppOutlined } from '@material-ui/icons';
import { ButtonLink, FormLayout } from 'components';
import { useTranslation, withAuth } from 'lib';
import { NextPage } from 'next';
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
        topNavbarProps: {
            disableAuthButtons: true,
        },
    };

    return <FormLayout {...layoutProps} />;
};

export default withAuth(ConfirmLogoutPage);

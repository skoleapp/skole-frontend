import { Box, Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { ButtonLink, FormLayout, LoadingLayout, OfflineLayout } from 'components';
import { useTranslation, withAuth } from 'lib';
import { NextPage } from 'next';
import React from 'react';
import { AuthProps } from 'types';
import { urls } from 'utils';

const ConfirmLogoutPage: NextPage<AuthProps> = ({ authLoading, authNetworkError }) => {
    const { t } = useTranslation();

    const renderCardContent = (
        <Box marginTop="1rem">
            <Typography variant="subtitle1">{t('logout:confirmLogout')}</Typography>
            <Box marginTop="1rem">
                <ButtonLink
                    href={urls.logout}
                    color="primary"
                    variant="contained"
                    endIcon={<ArrowForwardOutlined />}
                    fullWidth
                >
                    {t('common:confirm')}
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
        renderCardContent,
        topNavbarProps: {
            disableAuthButtons: true,
        },
    };

    if (authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    if (authNetworkError) {
        return <OfflineLayout seoProps={seoProps} />;
    }

    return <FormLayout {...layoutProps} />;
};

export default withAuth(ConfirmLogoutPage);

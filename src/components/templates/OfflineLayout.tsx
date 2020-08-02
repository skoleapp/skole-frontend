import { CardHeader } from '@material-ui/core';
import { useTranslation } from 'lib';
import React from 'react';

import { StyledCard } from '..';
import { MainLayout } from './MainLayout';

export const OfflineLayout: React.FC = () => {
    const { t } = useTranslation();

    const layoutProps = {
        seoProps: {
            title: t('offline:title'),
            description: t('offline:description'),
        },
        topNavbarProps: {
            dynamicBackUrl: true,
            disableAuthButtons: true,
        },
    };

    return (
        <MainLayout {...layoutProps}>
            <StyledCard>
                <CardHeader title={t('offline:header')} />
            </StyledCard>
        </MainLayout>
    );
};

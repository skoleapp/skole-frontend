import { CardHeader } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { StyledCard } from '../shared';
import { MainLayout } from './MainLayout';

export const NotFoundLayout: React.FC = () => {
    const { t } = useTranslation();

    const layoutProps = {
        seoProps: {
            title: t('404:title'),
            description: t('404:description'),
        },
        topNavbarProps: {
            dynamicBackUrl: true,
        },
    };

    return (
        <MainLayout {...layoutProps}>
            <StyledCard>
                <CardHeader title={t('404:header')} />
            </StyledCard>
        </MainLayout>
    );
};

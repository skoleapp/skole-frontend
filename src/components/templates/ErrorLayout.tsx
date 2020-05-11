import { CardHeader } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { StyledCard } from '../shared';
import { MainLayout } from './MainLayout';

export const ErrorLayout: React.FC = () => {
    const { t } = useTranslation();

    const layoutProps = {
        seoProps: {
            title: t('_error:title'),
            description: t('_error:description'),
        },
        topNavbarProps: {
            dynamicBackUrl: true,
        },
    };

    return (
        <MainLayout {...layoutProps}>
            <StyledCard>
                <CardHeader title={t('_error:header')} />
            </StyledCard>
        </MainLayout>
    );
};

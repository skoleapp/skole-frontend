import React from 'react';
import { useTranslation } from 'react-i18next';

import { StyledCard } from '..';
import { LoadingBox } from '../shared';
import { MainLayout } from './MainLayout';

export const LoadingLayout: React.FC = () => {
    const { t } = useTranslation();

    const layoutProps = {
        seoProps: {
            title: t('loading:title'),
            description: t('loading:description'),
        },
        disableBottomNavbar: true,
    };

    return (
        <MainLayout {...layoutProps}>
            <StyledCard>
                <LoadingBox />
            </StyledCard>
        </MainLayout>
    );
};

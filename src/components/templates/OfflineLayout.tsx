import { CardHeader } from '@material-ui/core';
import { useTranslation } from 'lib';
import React from 'react';
import { MainLayoutProps } from 'types';

import { StyledCard } from '..';
import { MainLayout } from './MainLayout';

export const OfflineLayout: React.FC<Pick<MainLayoutProps, 'seoProps'>> = ({ seoProps }) => {
    const { t } = useTranslation();

    const layoutProps = {
        seoProps,
        topNavbarProps: {
            dynamicBackUrl: true,
            disableAuthButtons: true,
        },
    };

    return (
        <MainLayout {...layoutProps}>
            <StyledCard>
                <CardHeader title={t('common:offline')} />
            </StyledCard>
        </MainLayout>
    );
};

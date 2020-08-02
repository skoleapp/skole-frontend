import { CardHeader } from '@material-ui/core';
import { useTranslation } from 'lib';
import React from 'react';

import { StyledCard } from '..';
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
            disableAuthButtons: true,
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

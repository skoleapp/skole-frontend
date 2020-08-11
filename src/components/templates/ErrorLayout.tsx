import { CardHeader } from '@material-ui/core';
import { useTranslation } from 'lib';
import React from 'react';
import { SEOProps } from 'types';

import { StyledCard } from '..';
import { MainLayout } from './MainLayout';

interface Props {
    seoProps?: SEOProps;
}

export const ErrorLayout: React.FC<Props> = ({ seoProps }) => {
    const { t } = useTranslation();

    const defaultSeoProps = {
        title: t('_error:title'),
        description: t('_error:description'),
    };

    const layoutProps = {
        seoProps: seoProps || defaultSeoProps,
        topNavbarProps: {
            dynamicBackUrl: true,
            disableAuthButtons: true,
        },
    };

    return (
        <MainLayout {...layoutProps}>
            <StyledCard onlyHeader>
                <CardHeader title={t('_error:header')} />
            </StyledCard>
        </MainLayout>
    );
};

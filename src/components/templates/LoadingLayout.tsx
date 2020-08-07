import React from 'react';
import { MainLayoutProps } from 'types';

import { StyledCard } from '..';
import { LoadingBox } from '../shared';
import { MainLayout } from './MainLayout';

export const LoadingLayout: React.FC<Pick<MainLayoutProps, 'seoProps'>> = ({ seoProps }) => {
    const layoutProps = {
        seoProps,
        disableBottomNavbar: true,
        topNavbarProps: {
            disableAuthButtons: true,
            disableLogo: true,
        },
    };

    return (
        <MainLayout {...layoutProps}>
            <StyledCard>
                <LoadingBox />
            </StyledCard>
        </MainLayout>
    );
};

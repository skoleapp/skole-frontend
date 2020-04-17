import React from 'react';

import { LoadingBox, StyledCard } from '../shared';
import { MainLayout } from './MainLayout';

export const LoadingLayout: React.FC = () => (
    <MainLayout>
        <StyledCard>
            <LoadingBox />
        </StyledCard>
    </MainLayout>
);

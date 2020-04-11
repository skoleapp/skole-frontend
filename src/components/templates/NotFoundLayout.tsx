import { CardHeader } from '@material-ui/core';
import React from 'react';

import { MainLayout, StyledCard } from '..';

interface Props {
    title: string;
}

export const NotFoundLayout: React.FC<Props> = ({ title }) => (
    <MainLayout title={title} dynamicBackUrl>
        <StyledCard>
            <CardHeader title={title} />
        </StyledCard>
    </MainLayout>
);

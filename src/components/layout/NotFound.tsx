import { CardHeader } from '@material-ui/core';
import React from 'react';

import { MainLayout, StyledCard } from '..';

interface Props {
    title: string;
}

export const NotFound: React.FC<Props> = ({ title }) => (
    <MainLayout title={title} backUrl>
        <StyledCard>
            <CardHeader title={title} />
        </StyledCard>
    </MainLayout>
);

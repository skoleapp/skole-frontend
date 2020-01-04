import { Layout, StyledCard } from '../shared';

import { CardHeader } from '@material-ui/core';
import React from 'react';

interface Props {
    title: string;
}

export const NotFound: React.FC<Props> = ({ title }) => (
    <Layout title={title} backUrl>
        <StyledCard>
            <CardHeader title={title} />
        </StyledCard>
    </Layout>
);

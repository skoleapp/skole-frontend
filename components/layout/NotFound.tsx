import { CardHeader } from '@material-ui/core';
import React from 'react';
import { Layout, StyledCard } from '../shared';

interface Props {
  title: string;
}

export const NotFound: React.FC<Props> = ({ title }) => (
  <Layout title="Not found..." backUrl>
    <StyledCard>
      <CardHeader title={title} />
    </StyledCard>
  </Layout>
);

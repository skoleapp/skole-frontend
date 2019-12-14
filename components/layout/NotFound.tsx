import { CardHeader } from '@material-ui/core';
import React from 'react';
import { Layout } from '.';
import { StyledCard } from '../shared';

interface Props {
  title: string;
  t: (value: string) => any;
}

export const NotFound: React.FC<Props> = ({ title, t }) => (
  <Layout t={t} title={t('titleNotFound')} backUrl="/">
    <StyledCard>
      <CardHeader title={title} />
    </StyledCard>
  </Layout>
);

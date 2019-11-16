import { NextPage } from 'next';
import React from 'react';
import { StyledCard } from '../../components';
import { Layout } from '../../containers';
import { withPrivate } from '../../utils';

const ActivityPage: NextPage = () => (
  <Layout title="Activity" backUrl="/">
    <StyledCard>Here will be activity...</StyledCard>
  </Layout>
);

export default withPrivate(ActivityPage);

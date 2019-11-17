import { NextPage } from 'next';
import React from 'react';
import { StyledCard } from '../../../components';
import { Layout } from '../../../containers';
import { withAuthSync } from '../../../utils';

const ResourcesPage: NextPage = () => (
  <Layout heading="Resources" title="Resources" backUrl="/courses">
    <StyledCard>Course resources will be here...</StyledCard>
  </Layout>
);

export default withAuthSync(ResourcesPage);

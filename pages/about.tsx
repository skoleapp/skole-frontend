import { NextPage } from 'next';
import React from 'react';
import { StyledCard } from '../components';
import { Layout } from '../containers';
import { withAuthSync } from '../utils';

const AboutPage: NextPage = () => (
  <Layout heading="About" title="About" backUrl="/">
    <StyledCard>Here will be about content...</StyledCard>
  </Layout>
);

export default withAuthSync(AboutPage);

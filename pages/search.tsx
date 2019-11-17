import { NextPage } from 'next';
import React from 'react';
import { StyledCard } from '../components';
import { Layout } from '../containers';
import { withAuthSync } from '../utils';

const SearchPage: NextPage = () => (
  <Layout heading="Search" title="Search" backUrl="/">
    <StyledCard>Here will be search...</StyledCard>
  </Layout>
);

export default withAuthSync(SearchPage);

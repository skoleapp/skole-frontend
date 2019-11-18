import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { StyledCard } from '../components';
import { Layout } from '../containers';
import { SkoleContext } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useAuthSync } from '../utils';

const SearchPage: NextPage = () => (
  <Layout heading="Search" title="Search" backUrl="/">
    <StyledCard>Here will be search...</StyledCard>
  </Layout>
);

SearchPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return {};
};

export default compose(withApollo, withRedux)(SearchPage);

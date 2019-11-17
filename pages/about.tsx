import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { StyledCard } from '../components';
import { Layout } from '../containers';
import { withApollo, withRedux } from '../lib';

const AboutPage: NextPage = () => (
  <Layout heading="About" title="About" backUrl="/">
    <StyledCard>Here will be about content...</StyledCard>
  </Layout>
);

export default compose(withRedux, withApollo)(AboutPage);

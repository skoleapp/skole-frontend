import { NextPage } from 'next';
import React from 'react';
import { LandingPageContent, Layout } from '../components';
import { withAuthSync } from '../utils';

const IndexPage: NextPage = () => (
  <Layout title="Home">
    <LandingPageContent />
  </Layout>
);

export default withAuthSync(IndexPage);

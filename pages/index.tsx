import { NextPage } from 'next';
import React from 'react';
import { LandingPageContent, Layout } from '../components';
import { withAuth } from '../lib/withAuth';

const IndexPage: NextPage = () => (
  <Layout title="Home">
    <LandingPageContent />
  </Layout>
);

export default withAuth(IndexPage);

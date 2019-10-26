import { NextPage } from 'next';
import React from 'react';
import { LandingPageContent, MainLayout } from '../components';
import { withAuth } from '../lib/withAuth';

const IndexPage: NextPage = () => (
  <MainLayout title="Home" secondary>
    <LandingPageContent />
  </MainLayout>
);

export default withAuth(IndexPage);

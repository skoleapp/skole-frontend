import { NextPage } from 'next';
import React from 'react';
import { LandingPage, MainLayout } from '../components';
import { withAuthSync } from '../lib';

const IndexPage: NextPage = () => (
  <MainLayout title="Home" secondary>
    <LandingPage />
  </MainLayout>
);

export default withAuthSync(IndexPage);

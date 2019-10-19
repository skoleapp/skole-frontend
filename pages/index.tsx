import { NextPage } from 'next';
import React from 'react';
import { LandingPage, MainLayout } from '../components';

const IndexPage: NextPage = () => (
  <MainLayout title="Home" secondary>
    <LandingPage />
  </MainLayout>
);

export default IndexPage;

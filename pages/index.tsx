import React from 'react';
import { LandingPage, MainLayout } from '../components';

const Index: React.FC = () => (
  <MainLayout title="Home" secondary>
    <LandingPage />
  </MainLayout>
);

export default Index;

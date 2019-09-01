import React from 'react';
import '../index.css';
import { Layout, TopHeader } from '../organisms';
import { LandingPage } from '../templates';

const Index: React.SFC<{}> = () => (
  <Layout title="skole | ebin oppimisalusta">
    <TopHeader />
    <LandingPage />
  </Layout>
);

export default Index;

import React from 'react';
import '../index.css';
import { Layout } from '../organisms/Layout';
import { LandingPage } from '../templates';
import TopHeader from '../organisms/TopHeader';

const Index: React.SFC<{}> = () => (
  <Layout title="skole | ebin oppimisalusta">
    <TopHeader />
    <LandingPage />
  </Layout>
);

export default Index;

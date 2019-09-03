import React from 'react';
import '../index.css';
import { Layout, TopHeader } from '../organisms';
import { LandingPage } from '../templates';
import { Background } from '../atoms';

const Index: React.SFC<{}> = () => (
  <Layout title="skole | ebin oppimisalusta">
    <TopHeader />
    <Background />
    <LandingPage />
  </Layout>
);

export default Index;

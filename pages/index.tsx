import { NextPage } from 'next';
import React from 'react';
import { LandingPage, Layout } from '../components';
import '../index.css';

const Index: NextPage = () => (
  <Layout title="skole | ebin oppimisalusta">
    <LandingPage />
  </Layout>
);

export default Index;

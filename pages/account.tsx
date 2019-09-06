import React from 'react';
import { Background, Layout, Title, TopHeader } from '../components';
import '../index.css';

const Account: React.SFC<{}> = () => (
  <Layout title="skole | account">
    <TopHeader />
    <Background />
    <Title font="monospace" size={100}>
      Hello user!
    </Title>
  </Layout>
);

export default Account;

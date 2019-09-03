import React from 'react';
import { Title, Background } from '../atoms';
import '../index.css';
import { Layout, TopHeader } from '../organisms';

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

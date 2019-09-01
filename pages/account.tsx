import React from 'react';
import { Title } from '../atoms';
import '../index.css';
import { Layout, TopHeader } from '../organisms';

const Account: React.SFC<{}> = () => (
  <Layout title="skole | account">
    <TopHeader />
    <Title font="monospace" size={100}>
      Hello user!
    </Title>
  </Layout>
);

export default Account;

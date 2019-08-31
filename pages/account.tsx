import React from 'react';
import { Title } from '../atoms';
import '../index.css';
import { Layout } from '../organisms/Layout';

const Account: React.SFC<{}> = () => (
  <Layout title="skole | account">
    <Title font="monospace" size={100}>
      Hello user!
    </Title>
  </Layout>
);

export default Account;

import React from 'react';
import { Layout, Title } from '../components';
import '../index.css';

const Account: React.FC = () => (
  <Layout title="skole | account">
    <Title font="monospace" size={100}>
      Hello user!
    </Title>
  </Layout>
);

export default Account;

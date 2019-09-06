import React from 'react';
import { Layout, Title, TopHeader } from '../components';
import '../index.css';

const EditAccount: React.SFC<{}> = () => (
  <Layout title="skole | account">
    <TopHeader />
    <Title font="monospace" size={100}>
      Edit account
    </Title>
  </Layout>
);

export default EditAccount;

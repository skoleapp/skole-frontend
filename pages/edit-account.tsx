import React from 'react';
import { Layout, Title } from '../components';
import '../index.css';

const EditAccount: React.SFC<{}> = () => (
  <Layout title="skole | account">
    <Title font="monospace" size={100}>
      Edit account
    </Title>
  </Layout>
);

export default EditAccount;

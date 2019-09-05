import React from 'react';
import { Title } from '../components/atoms';
import { Layout, TopHeader } from '../components/organisms';
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

import React from 'react';
import { Title } from '../atoms';
import '../index.css';
import { Layout } from '../organisms/Layout';
import TopHeader from '../organisms/TopHeader';

const EditAccount: React.SFC<{}> = () => (
  <Layout title="skole | account">
    <TopHeader />
    <Title font="monospace" size={100}>
      Edit account
    </Title>
  </Layout>
);

export default EditAccount;

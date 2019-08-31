import React from 'react';
import { Title } from '../atoms';
import '../index.css';
import { Layout } from '../organisms/Layout';

const EditAccount: React.SFC<{}> = () => (
  <Layout title="skole | account">
    <Title font="monospace" size={100}>
      Edit account
    </Title>
  </Layout>
);

export default EditAccount;

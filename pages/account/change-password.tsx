import { NextPage } from 'next';
import React from 'react';
import { ChangePasswordCard, Layout } from '../../components';
import { withPrivate } from '../../utils';

const ChangePasswordPage: NextPage = () => (
  <Layout title="Account">
    <ChangePasswordCard />
  </Layout>
);

export default withPrivate(ChangePasswordPage);

import { NextPage } from 'next';
import React from 'react';
import { AccountMenu, Layout } from '../../components';
import { withPrivate } from '../../lib';

const AccountPage: NextPage = () => (
  <Layout title="Account">
    <AccountMenu />
  </Layout>
);

export default withPrivate(AccountPage);

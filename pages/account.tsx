import { NextPage } from 'next';
import React from 'react';
import { AccountPage, MainLayout, PrivatePage } from '../components';
import { useAccount } from '../components/hooks';
import { withAuthSync } from '../utils';

const Account: NextPage = () => (
  <MainLayout title="Account">
    <PrivatePage component={AccountPage} />
  </MainLayout>
);

Account.getInitialProps = async ctx => {
  const data = await useAccount(ctx);
  return { data };
};

export default withAuthSync(Account);

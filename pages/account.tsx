import React from 'react';
import { AccountPage, MainLayout, PrivatePage } from '../components';

const Account: React.FC = () => (
  <MainLayout title="Account" secondary>
    <PrivatePage component={AccountPage} />
  </MainLayout>
);

export default Account;

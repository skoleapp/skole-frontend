import React from 'react';
import { AccountPage, MainLayout, PrivatePage } from '../components';

const Account: React.FC = () => (
  <PrivatePage>
    <MainLayout title="Account">
      <AccountPage />
    </MainLayout>
  </PrivatePage>
);

export default Account;

import React from 'react';
import { AccountPage, MainLayout, PrivatePage } from '../components';

const Account: React.FC = () => (
  <MainLayout title="Account">
    <PrivatePage>
      <AccountPage />
    </PrivatePage>
  </MainLayout>
);

export default Account;

import React from 'react';
import { LogoutPage, MainLayout } from '../components';

const Logout: React.FC = () => (
  <MainLayout title="Login" secondary>
    <LogoutPage />
  </MainLayout>
);

export default Logout;

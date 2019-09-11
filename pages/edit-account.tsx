import React from 'react';
import { EditAccountPage, MainLayout, PrivatePage } from '../components';

const EditAccount: React.FC = () => (
  <PrivatePage>
    <MainLayout title="Edit Account">
      <EditAccountPage />
    </MainLayout>
  </PrivatePage>
);

export default EditAccount;

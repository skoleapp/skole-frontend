import React from 'react';
import { EditAccountPage, MainLayout, PrivatePage } from '../components';

const EditAccount: React.FC = () => (
  <MainLayout title="Edit Account">
    <PrivatePage component={EditAccountPage} />
  </MainLayout>
);

export default EditAccount;

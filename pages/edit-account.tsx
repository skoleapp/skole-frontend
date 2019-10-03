import React from 'react';
import { EditAccountPage, MainLayout, PrivatePage } from '../components';
import { useAccount } from '../components/hooks';
import { LoadingScreen } from '../components/layout';

const EditAccount: React.FC = () => {
  const [user, loading] = useAccount();

  if (loading) {
    return <LoadingScreen loadingText="Loading account details..." />;
  }

  const { title, username, email, bio, language } = user;

  const initialValues = {
    title: title || '',
    username: username || '',
    email: email || '',
    bio: bio || '',
    language: language || ''
  };

  return (
    <MainLayout title="Account">
      <PrivatePage component={EditAccountPage} initialValues={initialValues} />
    </MainLayout>
  );
};

export default EditAccount;

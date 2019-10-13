import React from 'react';
import { EditUserCard, MainLayout } from '../../../components';

const EditUserPage: React.FC = () => {
  // const [user, loading] = useAccount();

  // if (loading) {
  //   return <LoadingScreen loadingText="Loading account details..." />;
  // }

  // const { title, username, email, bio, language } = user;

  // const initialValues = {
  //   title: title || '',
  //   username: username || '',
  //   email: email || '',
  //   bio: bio || '',
  //   language: language || ''
  // };

  const initialValues = {
    id: '',
    title: '',
    username: '',
    email: '',
    bio: '',
    points: 0,
    language: ''
  };

  return (
    <MainLayout title="Edit User">
      <EditUserCard initialValues={initialValues} />
    </MainLayout>
  );
};

export default EditUserPage;

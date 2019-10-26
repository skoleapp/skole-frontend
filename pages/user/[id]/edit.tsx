import { NextPage } from 'next';
import React from 'react';
import { useSelector } from 'react-redux';
import { EditUserCard, MainLayout, NotFoundCard } from '../../../components';
import { State } from '../../../interfaces';
import { withPrivate } from '../../../lib';
import { userNotFoundText } from '../../../utils';

const EditUserPage: NextPage = () => {
  const { user } = useSelector((state: State) => state.auth);

  const initialValues = {
    id: (user && user.id) || '',
    title: (user && user.title) || '',
    username: (user && user.username) || '',
    email: (user && user.email) || '',
    bio: (user && user.bio) || '',
    language: (user && user.language) || '',
    points: (user && user.points) || 0
  };

  return (
    <MainLayout title="Edit User">
      {user ? (
        <EditUserCard initialValues={initialValues} />
      ) : (
        <NotFoundCard text={userNotFoundText} />
      )}
    </MainLayout>
  );
};

export default withPrivate(EditUserPage);

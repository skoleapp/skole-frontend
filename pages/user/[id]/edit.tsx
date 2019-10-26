import { NextPage } from 'next';
import React from 'react';
import { useSelector } from 'react-redux';
import { EditUserCard, Layout, NotFoundCard } from '../../../components';
import { State } from '../../../interfaces';
import { withPrivate } from '../../../lib';
import { userNotFoundText } from '../../../utils';

const EditUserPage: NextPage = () => {
  const { user, authenticated } = useSelector((state: State) => state.auth);

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
    <Layout title="Edit User">
      {authenticated ? (
        <EditUserCard initialValues={initialValues} />
      ) : (
        <NotFoundCard text={userNotFoundText} />
      )}
    </Layout>
  );
};

export default withPrivate(EditUserPage);

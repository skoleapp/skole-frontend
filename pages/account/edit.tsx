import { NextPage } from 'next';
import React from 'react';
import { useSelector } from 'react-redux';
import { EditUserCard, Layout } from '../../components';
import { State } from '../../interfaces';
import { withPrivate } from '../../lib';

const EditAccountPage: NextPage = () => {
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
    <Layout title="Edit User">
      <EditUserCard initialValues={initialValues} />
    </Layout>
  );
};

export default withPrivate(EditAccountPage);

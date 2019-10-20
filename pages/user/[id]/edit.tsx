import { NextPage } from 'next';
import React from 'react';
import { EditUserCard, MainLayout } from '../../../components';
import { SkoleContext, User, UserPageInitialProps } from '../../../interfaces';
import { redirect, withAuthSync } from '../../../lib';

interface Props {
  user?: User;
}

const EditUserPage: NextPage<Props> = ({ user }) => {
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
      <EditUserCard initialValues={initialValues} />
    </MainLayout>
  );
};

EditUserPage.getInitialProps = async (ctx: SkoleContext): Promise<UserPageInitialProps> => {
  const { store, query } = ctx;
  const { authenticated, user } = store.getState().auth;

  if (query.id !== user.id) {
    redirect(ctx, `/user/${query.id}`); // Redirect to public user profile page if not own profile.
  } else {
    if (authenticated) {
      return { user };
    }
  }

  return {};
};

export default withAuthSync(EditUserPage);

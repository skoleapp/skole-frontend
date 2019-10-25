import { NextPage } from 'next';
import React from 'react';
import { getUserMe } from '../../../actions';
import { EditUserCard, MainLayout, NotFoundCard } from '../../../components';
import { SkoleContext, User } from '../../../interfaces';
import { redirect, withApollo } from '../../../lib';
import { userNotFoundText } from '../../../utils';

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
      {user ? (
        <EditUserCard initialValues={initialValues} />
      ) : (
        <NotFoundCard text={userNotFoundText} />
      )}
    </MainLayout>
  );
};

EditUserPage.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
  const { query, apolloClient } = ctx;
  const { userMe } = await getUserMe(apolloClient);

  if (userMe && query.id !== userMe.id) {
    return redirect(ctx, `/user/${query.id}`); // Redirect to public user profile page if not own profile.
  } else if (userMe) {
    return { user: userMe };
  } else {
    return {};
  }
};

export default withApollo(EditUserPage);

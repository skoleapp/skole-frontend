import { NextPage } from 'next';
import React from 'react';
import { getUser } from '../../../actions';
import { MainLayout, NotFoundCard, UserInfoCard } from '../../../components';
import { SkoleContext } from '../../../interfaces';
import { redirect, withAuthSync } from '../../../lib';

const userNotFoundText = 'The user you were looking for was not found...';

const UserPage: NextPage<any> = ({ user }) => (
  <MainLayout title="User">
    {user ? <UserInfoCard {...user} /> : <NotFoundCard text={userNotFoundText} />}
  </MainLayout>
);

// eslint-disable-next-line
UserPage.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
  const { store, query, apolloClient } = ctx;
  const userMe = store.getState().auth.user;

  // Use public or private profile based on query.
  if (query.id !== userMe.id) {
    const { user } = await getUser(query.id as any, apolloClient);
    return { user };
  } else {
    if (!userMe) {
      redirect(ctx, '/');
    } else {
      return { user: userMe };
    }
  }
};

export default withAuthSync(UserPage);

import { NextPage } from 'next';
import React from 'react';
import { getUser, getUserMe } from '../../../actions';
import { MainLayout, NotFoundCard, UserInfoCard } from '../../../components';
import { SkoleContext, UserPageInitialProps } from '../../../interfaces';
import { withApollo } from '../../../lib';
import { userNotFoundText } from '../../../utils';

const UserPage: NextPage<any> = ({ user }) => (
  <MainLayout title="User">
    {user ? <UserInfoCard {...user} /> : <NotFoundCard text={userNotFoundText} />}
  </MainLayout>
);

UserPage.getInitialProps = async (ctx: SkoleContext): Promise<UserPageInitialProps> => {
  const { query, apolloClient } = ctx;
  const { userMe } = await getUserMe(apolloClient);

  // Use public or private profile based on query.
  if (userMe && query.id !== userMe.id) {
    const { user } = await getUser(query.id as any, apolloClient); // eslint-disable-line
    return { user };
  } else {
    return { user: userMe };
  }
};

export default withApollo(UserPage);

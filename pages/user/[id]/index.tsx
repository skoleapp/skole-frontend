import { NextPage } from 'next';
import React from 'react';
import { getUser, getUserMe } from '../../../actions';
import { Layout, NotFoundCard, UserInfoCard } from '../../../components';
import { SkoleContext, UserPageProps } from '../../../interfaces';
import { withAuth } from '../../../lib';
import { userNotFoundText } from '../../../utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserPage: NextPage<any> = ({ user }) => (
  <Layout title="User">
    {user ? <UserInfoCard {...user} /> : <NotFoundCard text={userNotFoundText} />}
  </Layout>
);

UserPage.getInitialProps = async (ctx: SkoleContext): Promise<UserPageProps> => {
  const { query, apolloClient } = ctx;
  const { userMe } = await getUserMe(apolloClient);

  // Use public or private profile based on query.
  if (userMe && query.id === userMe.id) {
    return { user: userMe };
  } else {
    const { user } = await getUser(query.id as any, apolloClient); // eslint-disable-line @typescript-eslint/no-explicit-any
    return { user };
  }
};

export default withAuth(UserPage);

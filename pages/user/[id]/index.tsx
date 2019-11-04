import { NextPage } from 'next';
import React from 'react';
import { getUser } from '../../../actions';
import { Layout, NotFoundCard, UserInfoCard } from '../../../components';
import { UserMeDocument } from '../../../generated/graphql';
import { PublicUser, SkoleContext } from '../../../interfaces';
import { redirect, withAuthSync } from '../../../utils';

interface Props {
  user: PublicUser | null;
}

const UserPage: NextPage<Props> = ({ user }) => (
  <Layout title="User">
    {user ? <UserInfoCard {...user} /> : <NotFoundCard text="User not found..." />}
  </Layout>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
UserPage.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
  const { query, apolloClient } = ctx;
  const { data } = await apolloClient.query({ query: UserMeDocument });

  if (data.userMe && data.userMe.id === query.id) {
    return redirect(ctx, '/account');
  }

  const { user } = await getUser(query.id as string, apolloClient); // eslint-disable-line @typescript-eslint/no-explicit-any
  return { user };
};

export default withAuthSync(UserPage as NextPage);

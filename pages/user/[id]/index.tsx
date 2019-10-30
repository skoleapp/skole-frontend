import { NextPage } from 'next';
import React from 'react';
import { getUser } from '../../../actions';
import { Layout, NotFoundCard, UserInfoCard } from '../../../components';
import { PublicUser, SkoleContext } from '../../../interfaces';
import { withAuth } from '../../../lib';
import { userNotFoundText } from '../../../utils';

interface Props {
  user: PublicUser | null;
}

const UserPage: NextPage<Props> = ({ user }) => (
  <Layout title="User">
    {user ? <UserInfoCard {...user} /> : <NotFoundCard text={userNotFoundText} />}
  </Layout>
);

UserPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  const { query, apolloClient } = ctx;
  const { user } = await getUser(query.id as string, apolloClient); // eslint-disable-line @typescript-eslint/no-explicit-any
  return { user };
};

export default withAuth(UserPage as NextPage);

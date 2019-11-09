import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { Layout, NotFoundCard, UserInfoCard } from '../../containers';
import { UserDocument } from '../../generated/graphql';
import { PublicUser, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { redirect, useSSRAuthSync } from '../../utils';

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
  const { userMe } = await useSSRAuthSync(ctx);
  const { query, apolloClient } = ctx;

  if (userMe && userMe.id === query.id) {
    return redirect(ctx, '/account/profile');
  }

  try {
    const { id } = query;
    const { data } = await apolloClient.query({ query: UserDocument, variables: { id } });
    return { user: data.user };
  } catch {
    return { user: null };
  }
};

export default compose(
  withRedux,
  withApollo
)(UserPage as NextPage);

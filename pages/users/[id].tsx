import { Avatar, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { StyledCard } from '../../components';
import { Layout, NotFoundCard } from '../../containers';
import { UserDocument } from '../../generated/graphql';
import { PublicUser, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { getAvatar, redirect, useSSRAuthSync } from '../../utils';

interface Props {
  user: PublicUser | null;
}

const UserPage: NextPage<Props> = ({ user }) => {
  if (user) {
    const { title, avatar, username, bio, points } = user;

    return (
      <Layout title="User" backUrl="/users">
        <StyledCard>
          <Typography variant="h5">{title}</Typography>
          <Avatar src={getAvatar(avatar)} />
          <div className="info-section">
            <Typography variant="body1">{username}</Typography>
            <Typography variant="body1">Bio: {bio}</Typography>
            <Typography variant="body1">Points: {points}</Typography>
          </div>
        </StyledCard>
      </Layout>
    );
  } else {
    return (
      <Layout title="User not found" backUrl="/users">
        <NotFoundCard text="User not found..." />
      </Layout>
    );
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
UserPage.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
  const { userMe } = await useSSRAuthSync(ctx);
  const { query, apolloClient } = ctx;
  const { id } = query;

  if (userMe && userMe.id === id) {
    return redirect(ctx, '/account/profile');
  }

  try {
    const { data } = await apolloClient.query({ query: UserDocument, variables: { id } });
    return { user: data.user };
  } catch {
    return { user: null };
  }
};

export default compose(withRedux, withApollo)(UserPage);

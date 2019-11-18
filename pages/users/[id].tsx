import { Avatar, Box, Divider, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { StyledCard } from '../../components';
import { Layout, NotFoundCard } from '../../containers';
import { UserDocument } from '../../generated/graphql';
import { PublicUser, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { getAvatar, redirect, useAuthSync } from '../../utils';

interface Props {
  user?: PublicUser;
}

const UserPage: NextPage<Props> = ({ user }) => {
  if (user) {
    const { username, avatar, title, bio, points } = user;

    return (
      <Layout heading={username} title={username} backUrl="/leaderboard">
        <StyledCard>
          <Box display="flex" alignItems="center" justifyContent="space-around">
            <Avatar src={getAvatar(avatar)} />
            <Typography variant="body1">{username}</Typography>
          </Box>
          <Divider />
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Typography variant="body1">{title}</Typography>
            <Typography variant="body2">{bio}</Typography>
            <Typography variant="body2">Points: {points}</Typography>
          </Box>
          <Divider />
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            Users courses will show here...
          </Box>
        </StyledCard>
      </Layout>
    );
  } else {
    return (
      <Layout title="User not found" backUrl="/leaderboard">
        <NotFoundCard text="User not found..." />
      </Layout>
    );
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
UserPage.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
  const { query, apolloClient } = ctx;
  const { userMe } = await useAuthSync(ctx);

  // Redirect to own profile if id matches logged in user.
  if (userMe && userMe.id === query.id) {
    return redirect(ctx, '/profile');
  }

  try {
    const { data } = await apolloClient.query({
      query: UserDocument,
      variables: { userId: query.id }
    });
    return { ...data };
  } catch {
    return {};
  }
};

export default compose(withRedux, withApollo)(UserPage);

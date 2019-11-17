import { Avatar, Box, Divider, Typography } from '@material-ui/core';
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
  user?: PublicUser;
}

const UserPage: NextPage<Props> = ({ user }) => {
  return user ? (
    <Layout heading={user.username} title={user.username} backUrl="/leaderboard">
      <StyledCard>
        <Box display="flex" alignItems="center" justifyContent="space-around">
          <Avatar src={getAvatar(user.avatar)} />
          <Typography variant="body1">{user.username}</Typography>
        </Box>
        <Divider />
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          {user.title && <Typography variant="body1">{user.title}</Typography>}
          {user.bio && <Typography variant="body2">{user.bio}</Typography>}
          <Typography variant="body2">Points: {user.points}</Typography>
        </Box>
        <Divider />
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          Users courses will show here...
        </Box>
      </StyledCard>
    </Layout>
  ) : (
    <Layout title="User not found" backUrl="/leaderboard">
      <NotFoundCard text="User not found..." />
    </Layout>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
UserPage.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
  const { userMe } = await useSSRAuthSync(ctx);
  const { query, apolloClient } = ctx;

  // Redirect to own profile if id matches logged in user.
  if (userMe && userMe.id === query.userId) {
    return redirect(ctx, '/profile');
  }

  try {
    const { data } = await apolloClient.query({ query: UserDocument, variables: { ...query } });
    return { ...data };
  } catch {
    return {};
  }
};

export default compose(withRedux, withApollo)(UserPage);

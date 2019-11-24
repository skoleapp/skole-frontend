import { Avatar, Box, CardContent, CardHeader, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { useSelector } from 'react-redux';
import { compose } from 'redux';
import { ButtonLink, Layout, StyledCard } from '../../components';
import { SkoleContext, State } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { getAvatar, usePrivatePage } from '../../utils';

const ProfilePage: NextPage = () => {
  const { user } = useSelector((state: State) => state.auth);
  const { title, avatar, username, bio, points } = user;

  return (
    <Layout heading="Profile" title="Profile" backUrl="/">
      <StyledCard>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-around">
            <Avatar src={getAvatar(avatar)} />
            <Box display="flex" flexDirection="column">
              <Typography variant="body1">{username}</Typography>
              <ButtonLink href="/profile/edit" color="primary" variant="outlined" fullWidth>
                edit profile
              </ButtonLink>
            </Box>
          </Box>
        </CardContent>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Typography variant="body1">{title || 'No Title'}</Typography>
            <Typography variant="body2">{bio || 'No bio'}</Typography>
            <Typography variant="body2">Points: {points}</Typography>
          </Box>
        </CardContent>
        <CardHeader>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            My courses will show here...
          </Box>
        </CardHeader>
      </StyledCard>
    </Layout>
  );
};

ProfilePage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await usePrivatePage(ctx);
  return {};
};

export default compose(withApollo, withRedux)(ProfilePage);

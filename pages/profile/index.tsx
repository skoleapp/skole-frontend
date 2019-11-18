import { Avatar, Box, Divider, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { useSelector } from 'react-redux';
import { compose } from 'redux';
import { ButtonLink, StyledCard } from '../../components';
import { Layout } from '../../containers';
import { SkoleContext, State } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { getAvatar, usePrivatePage } from '../../utils';

const ProfilePage: NextPage = () => {
  const { user } = useSelector((state: State) => state.auth);
  const { title, avatar, username, bio, points } = user;

  return (
    <Layout title="Profile" backUrl="/">
      <StyledCard>
        <Box display="flex" alignItems="center" justifyContent="space-around">
          <Avatar src={getAvatar(avatar)} />
          <Box display="flex" flexDirection="column">
            <Typography variant="body1">{username}</Typography>
            <ButtonLink href="/profile/edit" color="primary" variant="outlined" fullWidth>
              edit profile
            </ButtonLink>
          </Box>
        </Box>
        <Divider />
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          {title && <Typography variant="body1">{title}</Typography>}
          {bio && <Typography variant="body2">{bio}</Typography>}
          <Typography variant="body2">Points: {points}</Typography>
        </Box>
        <Divider />
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          My courses will show here...
        </Box>
      </StyledCard>
    </Layout>
  );
};

ProfilePage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await usePrivatePage(ctx);
  return {};
};

export default compose(withApollo, withRedux)(ProfilePage);

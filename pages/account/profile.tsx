import { Avatar, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { useSelector } from 'react-redux';
import { ButtonLink, StyledCard, TextLink } from '../../components';
import { Layout } from '../../containers';
import { State } from '../../interfaces';
import { getAvatar, withPrivate } from '../../utils';

const ProfilePage: NextPage = () => {
  const { user } = useSelector((state: State) => state.auth);
  const { title, avatar, username, bio, points } = user;

  return (
    <Layout title="Account">
      <StyledCard>
        <Typography variant="h5">{title}</Typography>
        <Avatar src={getAvatar(avatar)} />
        <div className="info-section">
          <Typography variant="body1">{username}</Typography>
          <Typography variant="body1">Bio: {bio}</Typography>
          <Typography variant="body1">Points: {points}</Typography>
        </div>
        <ButtonLink href="/account/edit" color="primary" variant="outlined" fullWidth>
          edit account
        </ButtonLink>
        <TextLink href="/account">Back to Account</TextLink>
      </StyledCard>
    </Layout>
  );
};

export default withPrivate(ProfilePage);

import { Avatar, Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { StyledCard } from '../components';
import { PublicUser, UserMe } from '../interfaces';
import { getAvatar } from '../utils';

export const UserInfoCard: React.FC<PublicUser | UserMe> = ({
  title,
  username,
  bio,
  points,
  avatar
}) => (
  <StyledUserInfoCard>
    <Typography variant="h5">{title}</Typography>
    <Avatar src={getAvatar(avatar)} />
    <div className="info-section">
      <Typography variant="body1">{username}</Typography>
      <Typography variant="body1">Bio: {bio}</Typography>
      <Typography variant="body1">Points: {points}</Typography>
    </div>
  </StyledUserInfoCard>
);

const StyledUserInfoCard = styled(StyledCard)`
  .info-section {
    margin-top: 1rem;

    p {
      margin: 0.5rem 0;
    }
  }

  .MuiAvatar-root {
    margin: 1rem auto;
    height: 12rem;
    width: 12rem;
  }
`;

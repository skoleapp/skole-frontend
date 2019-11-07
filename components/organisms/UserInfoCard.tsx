import { Avatar, Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { getAvatar } from '../../utils';
import { Card } from '../containers';

export const UserInfoCard: React.FC<any> = ({ title, username, bio, points, avatar }) => (
  <StyledCard>
    <Typography variant="h5">{title}</Typography>
    <Avatar src={getAvatar(avatar)} />
    <div className="info-section">
      <Typography variant="body1">{username}</Typography>
      <Typography variant="body1">Bio: {bio}</Typography>
      <Typography variant="body1">Points: {points}</Typography>
    </div>
  </StyledCard>
);

const StyledCard = styled(Card)`
  .info-section {
    margin-top: 1rem;

    p {
      margin: 0.5rem 0;
    }
  }

  .MuiAvatar-root {
    margin: 0 auto;
    width: 10rem;
    height: 10rem;
  }
`;

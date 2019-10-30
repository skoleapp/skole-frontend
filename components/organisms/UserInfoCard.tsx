import { Avatar, Button, Typography } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { PublicUser, UserMe } from '../../interfaces';
import { Card } from '../containers';

export const UserInfoCard: React.FC<PublicUser | UserMe> = ({ title, username, bio, points }) => (
  <StyledCard>
    <Typography variant="h5">{title}</Typography>
    <Avatar src="https://myconstructor.gr/img/customers-imgs/avatar.png" />
    <div className="info-section">
      <Typography variant="body1">{username}</Typography>
      <Typography variant="body1">Bio: {bio}</Typography>
      <Typography variant="body1">Points: {points}</Typography>
    </div>
    <Link href="/account/edit">
      <Button variant="contained" color="primary" fullWidth>
        edit account
      </Button>
    </Link>
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

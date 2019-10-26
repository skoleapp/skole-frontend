import { Button, Typography, Avatar } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { User } from '../../interfaces';
import { Card } from '../atoms';

const InfoSection = styled.div`
  margin-top: 1rem;
`;

export const UserInfoCard: React.FC<User> = ({ id, title, username, bio, points }) => (
  <StyledCard>
    <Typography variant="h5">{title}</Typography>
    <Avatar src="https://myconstructor.gr/img/customers-imgs/avatar.png" />
    <InfoSection>
      <Typography variant="body1">{username}</Typography>
      <Typography variant="body1">Bio: {bio}</Typography>
      <Typography variant="body1">Points: {points}</Typography>
    </InfoSection>
    <Link href={`/user/${id}/edit`}>
      <Button variant="contained" color="primary" fullWidth>
        edit account
      </Button>
    </Link>
  </StyledCard>
);

const StyledCard = styled(Card)`
  p {
    margin: 0.5rem 0;
  }

  .MuiAvatar-root {
    margin: 0 auto;
    width: 10rem;
    height: 10rem;
  }
`;

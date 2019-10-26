import { Button, Typography } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { User } from '../../interfaces';
import { Card } from '../atoms';

const StyledImage = styled.img`
  height: 10rem;
  width: 10rem;
  border-radius: 0.5rem;
`;

const InfoSection = styled.div`
  margin-top: 1rem;
`;

export const UserInfoCard: React.FC<User> = ({
  id,
  title,
  username,
  email,
  bio,
  points,
  language
}) => (
  <Card>
    <Typography variant="h5">{title}</Typography>
    <StyledImage src="https://myconstructor.gr/img/customers-imgs/avatar.png" />
    <InfoSection>
      <Typography variant="body1">Username: {username}</Typography>
      <Typography variant="body1">Email: {email}</Typography>
      <Typography variant="body1">Bio: {bio}</Typography>
      <Typography variant="body1">Points: {points}</Typography>
      <Typography variant="body1">Language: {language}</Typography>
    </InfoSection>
    <Link href={`/user/${id}/edit`}>
      <Button variant="contained" color="primary" fullWidth>
        edit account
      </Button>
    </Link>
  </Card>
);

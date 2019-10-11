import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { User } from '../../interfaces';
import avatar from '../../static/avatar.jpg';
import { Button, Card, H3, Text } from '../atoms';

const StyledImage = styled.img`
  height: 10rem;
  width: 10rem;
  border-radius: 0.5rem;
`;

const InfoSection = styled.div`
  margin-top: 1rem;
`;

export const UserInfoCard: React.FC<User> = ({ title, username, email, bio, points, language }) => (
  <Card>
    <H3>{title}</H3>
    <StyledImage src={avatar} />
    <InfoSection>
      <Text>Username: {username}</Text>
      <Text>Email: {email}</Text>
      <Text>Bio: {bio}</Text>
      <Text>Points: {points}</Text>
      <Text>Language: {language}</Text>
    </InfoSection>
    <Link href="/edit-account">
      <Button>edit account</Button>
    </Link>
  </Card>
);

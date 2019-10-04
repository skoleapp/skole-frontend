import React from 'react';
import { User } from '../../interfaces';
import { H1 } from '../atoms';
import { UserInfoCard } from '../molecules';

interface Props {
  user: User;
}

export const AccountPage: React.FC<Props> = ({ user }) => (
  <>
    <H1>Account</H1>
    <UserInfoCard {...user} />
  </>
);

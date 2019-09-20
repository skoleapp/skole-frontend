import Link from 'next/link';
import React from 'react';
import { User } from '../../interfaces';
import { Button, H1, H3 } from '../atoms';

export const AccountPage: React.FC<User> = ({ title, username, email, bio, points, language }) => (
  <>
    <H1>Account</H1>
    <div>
      <H3>Title: {title}</H3>
      <p>Username: {username}</p>
      <p>Email: {email}</p>
      <p>Bio: {bio}</p>
      <p>Points: {points}</p>
      <p>Language: {language}</p>
    </div>
    <Link href="/edit-account">
      <Button>edit account</Button>
    </Link>
  </>
);

import React from 'react';
import { Button, Card, Flexbox } from '../atoms';
import { Login } from '../templates';

export const LoginBox: React.FC = () => (
  <Card>
    <Flexbox justifyContent="center">
      <Login />
    </Flexbox>
    <Flexbox justifyContent="center">
      <Button>Register</Button>
    </Flexbox>
  </Card>
);

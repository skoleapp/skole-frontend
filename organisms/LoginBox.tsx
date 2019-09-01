import React from 'react';
import { Login } from '.';
import { Button, Card, Flexbox } from '../atoms';

export const LoginBox: React.SFC<{}> = () => (
  <Card>
    <Flexbox justifyContent="center">
      <Login />
    </Flexbox>
    <Flexbox justifyContent="center">
      <Button>Register</Button>
    </Flexbox>
  </Card>
);

import React from 'react';
import { Login } from '.';
import { Button, Card, FlexBox } from '../atoms';

export const LoginBox: React.SFC<{}> = () => (
  <Card>
    <FlexBox justifyContent="center">
      <Login />
    </FlexBox>
    <FlexBox justifyContent="center">
      <Button>Register</Button>
    </FlexBox>
  </Card>
);

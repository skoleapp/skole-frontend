import React from 'react';
import { FlexBox, Card, Button } from '../atoms';
import { Login } from '../organisms';

export const Loginbox: React.SFC<{}> = () => (
  <Card>
    <FlexBox justifyContent="center">
      <Login></Login>
    </FlexBox>
    <FlexBox justifyContent="center">
      <Button>Register</Button>
    </FlexBox>
  </Card>
);

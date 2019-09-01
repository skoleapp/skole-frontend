import React, { useState } from 'react';
import { Card, Button, FlexBox, Title } from '../atoms';
import { Login, Register } from '../templates';

export const AuthBox: React.SFC<{}> = () => {
  const [loginOpen, setLoginOpen] = useState(true);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <Card>
      <FlexBox
        justifyContent="space-between"
        flexDirection="column"
        alignItems="center"
        style={{ height: '100%' }}
      >
        <Title>Skole</Title>

        {loginOpen && !registerOpen && <Login />}
        {registerOpen && !loginOpen && <Register />}

        {!loginOpen && (
          <Button
            onClick={() => {
              setLoginOpen(true);
              setRegisterOpen(false);
            }}
          >
            Kirjaudu sisään
          </Button>
        )}
        {!registerOpen && (
          <Button
            onClick={() => {
              setRegisterOpen(true);
              setLoginOpen(false);
            }}
          >
            Rekisteröidy
          </Button>
        )}
      </FlexBox>
    </Card>
  );
};

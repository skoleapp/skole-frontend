import React, { useState } from 'react';
import { Card, Flexbox, Title, Anchor } from '../atoms';
import { Login, Register } from '../templates';

export const AuthBox: React.SFC<{}> = () => {
  const [loginOpen, setLoginOpen] = useState(true);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <Card>
      <Flexbox
        justifyContent="space-between"
        flexDirection="column"
        alignItems="center"
        style={{ height: '100%' }}
      >
        <Title font="none" margin="30px 0px 0px 0px">
          Skole
        </Title>

        {loginOpen && !registerOpen && <Login />}
        {registerOpen && !loginOpen && <Register />}

        {!loginOpen && (
          <Anchor
            onClick={() => {
              setLoginOpen(true);
              setRegisterOpen(false);
            }}
          >
            Löytyykö jo käyttäjä?
          </Anchor>
        )}
        {!registerOpen && (
          <Anchor
            onClick={() => {
              setRegisterOpen(true);
              setLoginOpen(false);
            }}
          >
            Uusi käyttäjä?
          </Anchor>
        )}
      </Flexbox>
    </Card>
  );
};

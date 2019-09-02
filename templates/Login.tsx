import React, { FormEvent, useState } from 'react';
//import { useDispatch } from 'react-redux';
//import { login } from '../actions';
import { FlexBox, Input, Button } from '../atoms';
import Router from 'next/router';

export const Login: React.FC<{}> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //const dispatch = useDispatch();

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    Router.push('/account');
    //dispatch(login({ email, password }));
  };

  return (
    <form onSubmit={(e): void => handleSubmit(e)}>
      <FlexBox justifyContent="center" flexDirection="column">
        <Input
          type="email"
          placeholder="Sähköposti"
          animation
          required
          value={email}
          onChange={(e): void => setEmail(e.target.value)}
        />
      </FlexBox>
      <FlexBox justifyContent="center" flexDirection="column">
        <Input
          type="password"
          placeholder="Salasana"
          animation
          required
          value={password}
          onChange={(e): void => setPassword(e.target.value)}
        />
      </FlexBox>
      <FlexBox justifyContent="center">
        <Button type="submit">Kirjaudu sisään</Button>
      </FlexBox>
    </form>
  );
};

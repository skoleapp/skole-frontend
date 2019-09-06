import React, { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../redux';
import { Button, Flexbox, Input } from '../atoms';

export const Login: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    dispatch(
      login({
        usernameOrEmail,
        password
      })
    );

    // Router.push('/account');
  };

  return (
    <form onSubmit={(e): void => handleSubmit(e)}>
      <Flexbox justifyContent="center" flexDirection="column">
        <Input
          type="text"
          placeholder="Sähköposti"
          animation
          required
          value={usernameOrEmail}
          onChange={(e): void => setUsernameOrEmail(e.target.value)}
        />
      </Flexbox>
      <Flexbox justifyContent="center" flexDirection="column">
        <Input
          type="password"
          placeholder="Salasana"
          animation
          required
          value={password}
          onChange={(e): void => setPassword(e.target.value)}
        />
      </Flexbox>
      <Flexbox justifyContent="center">
        <Button type="submit">Kirjaudu sisään</Button>
      </Flexbox>
    </form>
  );
};

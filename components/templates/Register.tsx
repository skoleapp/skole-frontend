import React, { SyntheticEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../redux';
import { Button, Flexbox, Input } from '../atoms';

export const Register: React.FC<{}> = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    dispatch(register({ username, email, password }));
  };

  return (
    <form onSubmit={(e): void => handleSubmit(e)}>
      <Flexbox justifyContent="center" flexDirection="column">
        <Input
          type="text"
          required
          placeholder="Käyttäjänimi"
          animation
          value={username}
          onChange={(e): void => setUsername(e.target.value)}
        />
      </Flexbox>
      <Flexbox justifyContent="center" flexDirection="column">
        <Input
          type="email"
          required
          placeholder="Sähköposti"
          animation
          value={email}
          onChange={(e): void => setEmail(e.target.value)}
        />
      </Flexbox>
      <Flexbox justifyContent="center" flexDirection="column">
        <Input
          type="password"
          required
          placeholder="Salasana"
          animation
          value={password}
          onChange={(e): void => setPassword(e.target.value)}
        />
      </Flexbox>
      <Flexbox justifyContent="center">
        <Button type="submit">Rekisteröidy</Button>
      </Flexbox>
    </form>
  );
};

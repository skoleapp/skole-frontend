import React, { SyntheticEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../actions';
import { FlexBox } from '../atoms';

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
      <FlexBox justifyContent="center">
        <input
          type="text"
          placeholder="Käyttäjänimi"
          required
          value={username}
          onChange={(e): void => setUsername(e.target.value)}
        />
      </FlexBox>
      <FlexBox justifyContent="center">
        <input
          type="email"
          placeholder="Sähköposti"
          required
          value={email}
          onChange={(e): void => setEmail(e.target.value)}
        />
      </FlexBox>
      <FlexBox justifyContent="center">
        <input
          type="password"
          placeholder="Salasana"
          required
          value={password}
          onChange={(e): void => setPassword(e.target.value)}
        />
      </FlexBox>
      <FlexBox justifyContent="center">
        <button type="submit">Rekisteröidy</button>
      </FlexBox>
    </form>
  );
};

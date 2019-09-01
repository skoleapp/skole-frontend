import React, { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../actions';
import { FlexBox } from '../atoms';

export const Login: React.FC<{}> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <form onSubmit={(e): void => handleSubmit(e)}>
      <FlexBox justifyContent="center">
        <input
          className="input"
          type="email"
          placeholder="Sähköposti"
          required
          value={email}
          onChange={(e): void => setEmail(e.target.value)}
        />
      </FlexBox>
      <FlexBox justifyContent="center">
        <input
          className="input"
          type="password"
          placeholder="Salasana"
          required
          value={password}
          onChange={(e): void => setPassword(e.target.value)}
        />
      </FlexBox>
      <FlexBox justifyContent="center">
        <button type="submit">Kirjaudu sisään</button>
      </FlexBox>
    </form>
  );
};

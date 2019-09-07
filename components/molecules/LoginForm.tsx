import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../redux';
import { Button, Input } from '../atoms';

export const LoginForm: React.FC = () => {
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
  };

  return (
    <form onSubmit={(e): void => handleSubmit(e)}>
      <Input
        type="text"
        placeholder="Email"
        required
        value={usernameOrEmail}
        onChange={(e: ChangeEvent<HTMLInputElement>): void => setUsernameOrEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e: ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)}
      />
      <Button type="submit" text="login" />
    </form>
  );
};

import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../redux';
import { Button, Input } from '../atoms';

export const RegisterForm: React.FC = () => {
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
      <Input
        type="text"
        required
        placeholder="Username"
        value={username}
        onChange={(e: ChangeEvent<HTMLInputElement>): void => setUsername(e.target.value)}
      />
      <Input
        type="email"
        required
        placeholder="Email"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>): void => setEmail(e.target.value)}
      />
      <Input
        type="password"
        required
        placeholder="Password"
        value={password}
        onChange={(e: ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)}
      />
      <Button type="submit" text="register" />
    </form>
  );
};

import React, { SyntheticEvent, useState } from 'react';
import { Button, Input } from '../atoms';

export const Login: React.FC<{}> = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsername = (e: SyntheticEvent): void => {
    const target = e.target as HTMLInputElement;
    setUsername(target.value);
    console.log(target.value);
  };

  const handlePassword = (e: SyntheticEvent): void => {
    const target = e.target as HTMLInputElement;
    setPassword(target.value);
    console.log(target.value);
  };

  const handleLogin = (e: SyntheticEvent): void => {
    setUsername('');
    setPassword('');
    console.log(e);
  };

  return (
    <>
      {!loginOpen && <Button onClick={(): void => setLoginOpen(true)}>Sign in</Button>}
      {loginOpen && (
        <form onSubmit={(e): void => handleLogin(e)}>
          <Input
            value={username}
            onChange={(username): void => handleUsername(username)}
            placeholder="Username"
          />
          <Input
            value={password}
            onChange={(password): void => handlePassword(password)}
            placeholder="Password"
            type="password"
          />
          <Button type="submit">Log in</Button>
        </form>
      )}
    </>
  );
};

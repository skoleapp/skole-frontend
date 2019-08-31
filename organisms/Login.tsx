import React, { SyntheticEvent, useState } from "react";
import { Button, Input } from "../atoms";

export const Login = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

  const handleLogin = (e: SyntheticEvent) => {
    e.preventDefault();
    //do magic
    setUsername("");
    setPassword("");
    console.log(e);
  };

  return (
    <>
      {!loginOpen && (
        <Button onClick={() => setLoginOpen(true)}>Sign in</Button>
      )}
      {loginOpen && (
        <form>
          <Input
            value={username}
            onChange={username => handleUsername(username)}
            placeholder="Username"
          />
          <Input
            value={password}
            onChange={password => handlePassword(password)}
            placeholder="Password"
            type="password"
          />
          <Button
            onClick={e => {
              handleLogin(e);
            }}
          >
            Log in
          </Button>
        </form>
      )}
    </>
  );
};

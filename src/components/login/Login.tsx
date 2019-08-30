import React, { useState } from "react";
import { Input, Button } from "./styles";

const Login = () => {
  const [loginOpen, setLoginOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsername = (username: any) => {
    setUsername(username.target.value);
    console.log(username.target.value);
  };
  const handlePassword = (password: any) => {
    setPassword(password.target.value);
    console.log(password.target.value);
  };
  const handleLogin = (e: any) => {
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

export default Login;

import React, { SyntheticEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../actions';

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
    <div>
      <h3>Sign Up</h3>
      <form onSubmit={(e): void => handleSubmit(e)}>
        <div>
          <input
            type="text"
            placeholder="username"
            required
            value={username}
            onChange={(e): void => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e): void => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e): void => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

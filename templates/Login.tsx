import React, { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../actions';

export const Login: React.FC<{}> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div>
      <h3>Sign In</h3>
      <form onSubmit={(e): void => handleSubmit(e)}>
        <div>
          <input
            className="input"
            type="text"
            placeholder="Email"
            required
            value={email}
            onChange={(e): void => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            className="input"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e): void => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

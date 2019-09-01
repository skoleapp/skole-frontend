import React, { useState, SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../redux/actions';

export const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(actions.register({ username, email, password }, 'register'));
  };

  return (
    <div>
      <h3>Sign Up</h3>
      <form onSubmit={e => handleSubmit(e)}>
        <div>
          <input
            type="text"
            placeholder="username"
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

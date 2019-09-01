import React, { useState, SyntheticEvent } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../redux/actions';

export const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(actions.authenticate({ email, password }, 'login'));
  };

  return (
    <div>
      <h3>Sign In</h3>
      <form onSubmit={e => handleSubmit(e)}>
        <div>
          <input
            className="input"
            //HUOM !
            type="text"
            placeholder="Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            className="input"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

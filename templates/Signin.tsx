import React, { useState, SyntheticEvent } from 'react';
import { connect } from 'react-redux';
import actions from '../redux/actions';

export const Signin = (props: any) => {
  const { authenticate } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    authenticate({ email: email, password: password }, 'login');
  };

  return (
    <div>
      <h3 className="title is-3">Sign In</h3>
      <form onSubmit={e => handleSubmit(e)}>
        <div>
          <input
            className="input"
            type="email"
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

export default connect(
  state => state,
  actions
)(Signin);

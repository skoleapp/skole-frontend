import React, { useState, SyntheticEvent } from "react";
import { connect } from "react-redux";
import actions from "../redux/actions";

const Signup = (props: any) => {
  const { register } = props;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    register(
      { username: username, email: email, password: password },
      "register"
    );
  };

  return (
    <>
      <h3>Sign Up</h3>
      <form onSubmit={e => handleSubmit(e)} style={{ width: "540px" }}>
        <div className="field">
          <p className="control">
            <input
              className="input"
              type="text"
              placeholder="username"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </p>
        </div>
        <div className="field">
          <p className="control">
            <input
              className="input"
              type="email"
              placeholder="Email ID"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </p>
        </div>
        <div className="field">
          <p className="control">
            <input
              className="input"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </p>
        </div>
        <div className="field">
          <p className="control has-text-centered">
            <button type="submit" className="button is-success">
              Register
            </button>
          </p>
        </div>
      </form>
    </>
  );
};

export default connect(
  state => state,
  actions
)(Signup);

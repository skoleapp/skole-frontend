import React, { useState, SyntheticEvent } from "react";
import { connect } from "react-redux";
import actions from "../redux/actions";

const Signin = (props: any) => {
  const { authenticate } = props;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    authenticate({ email: email, password: password }, "signin");
  };

  return (
    <>
      <h3 className="title is-3">Sign In</h3>
      <form
        onSubmit={e => handleSubmit(e)}
        className="container"
        style={{ width: "540px" }}
      >
        <div className="field">
          <p className="control">
            <input
              className="input"
              type="email"
              placeholder="Email ID"
              required
              value={this.state.email_id}
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
              value={this.state.password}
              onChange={e => setPassword(e.target.value)}
            />
          </p>
        </div>
        <div className="field">
          <p className="control has-text-centered">
            <button type="submit" className="button is-success">
              Sign In
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
)(Signin);

import React from "react";
import { Flexbox, Card, Button } from "../atoms";
import { Login } from "../organisms";

export const Loginbox = () => {
  return (
    <Card>
      <Flexbox justifyContent="center">
        <Login></Login>
      </Flexbox>
      <Flexbox justifyContent="center">
        <Button>Register</Button>
      </Flexbox>
    </Card>
  );
};

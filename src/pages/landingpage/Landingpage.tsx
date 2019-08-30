import React from "react";

import { Wrapper, Header, Title } from "./styles";
import Login from "../../components/login/Login";
import Flexbox from "flexbox-react";

const Landingpage = () => {
  return (
    <Wrapper>
      <Header>
        <Flexbox justifyContent="flex-end">
          <Login />
        </Flexbox>
      </Header>
      <Title font="cursive">Skole!</Title>
    </Wrapper>
  );
};

export default Landingpage;

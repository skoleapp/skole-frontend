import React from "react";

import { Wrapper, Header, Title } from "./styles";
import Login from "../../components/login/Login";
import IntersectingWrapper from "../../components/intersecting/IntersectingWrapper";
import Flexbox from "flexbox-react";

const Landingpage = () => {
  return (
    <Wrapper>
      <Header>
        <Flexbox justifyContent="flex-end">
          <Login />
        </Flexbox>
      </Header>
      <IntersectingWrapper time={1}>
        <Title font="cursive">Skole!</Title>
      </IntersectingWrapper>
    </Wrapper>
  );
};

export default Landingpage;

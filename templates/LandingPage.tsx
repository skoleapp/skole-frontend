import React from "react";
import { Wrapper, Header, Title } from "../atoms";
import { Login } from "../organisms";
import { IntersectingWrapper } from "../molecules";
import Flexbox from "flexbox-react";

export const LandingPage = () => {
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

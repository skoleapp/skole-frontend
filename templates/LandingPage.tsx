import React from "react";
import { Wrapper, Title } from "../atoms";
import { IntersectingWrapper } from "../molecules";
import Link from "next/link";

export const LandingPage = () => {
  return (
    <Wrapper>
      <IntersectingWrapper time={1}>
        <Title font="monospace">Skole!</Title>
      </IntersectingWrapper>
      <Link href="/user">
        <Title>
          <button>User page</button>
        </Title>
      </Link>
    </Wrapper>
  );
};

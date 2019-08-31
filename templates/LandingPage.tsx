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
      <Title>
        <Link href="/account">
          <button>User page</button>
        </Link>
        <Link href="/search-schools">
          <button>search-schools</button>
        </Link>
      </Title>
    </Wrapper>
  );
};

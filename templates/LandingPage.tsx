import React from 'react';
import { Title, Wrapper } from '../atoms';
import { IntersectingWrapper } from '../molecules';

export const LandingPage: React.SFC<{}> = () => {
  return (
    <Wrapper>
      <IntersectingWrapper time={1}>
        <Title font="monospace">Skole!</Title>
      </IntersectingWrapper>
    </Wrapper>
  );
};

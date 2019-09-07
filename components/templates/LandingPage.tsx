import React from 'react';
import { Centered, Input, Title, Wrapper } from '../atoms';
import { IntersectingWrapper } from '../molecules';

export const LandingPage: React.FC = () => {
  return (
    <Wrapper>
      <IntersectingWrapper time={2}>
        <Centered top="20%">
          <Title size={100}>skole</Title>
          <IntersectingWrapper time={4}>
            <Input width="400px" type="text" placeholder="Hae kursseja..." fontSize="2em"></Input>
          </IntersectingWrapper>
        </Centered>
      </IntersectingWrapper>
    </Wrapper>
  );
};

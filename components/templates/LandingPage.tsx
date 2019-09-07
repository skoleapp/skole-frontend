import React from 'react';
import styled from 'styled-components';
import { GoButton, Header, SearchInput } from '../atoms';
import { IntersectingWrapper, Row } from '../molecules';

const StyledLanginPage = styled.div`
  margin-top: 2rem;

  .input-section {
    margin-top: 2rem;
  }
`;

export const LandingPage: React.FC = () => (
  <StyledLanginPage>
    {/* <Row>
      <Column> */}
    <IntersectingWrapper time={4}>
      <Header />
      <Row className="input-section">
        <SearchInput type="text" placeholder="Search courses..." />
        <GoButton />
      </Row>
    </IntersectingWrapper>
    {/* </Column>
    </Row> */}
  </StyledLanginPage>
);

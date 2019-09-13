import React from 'react';
import styled from 'styled-components';
import { GoButton, LogoHeader, SearchInput } from '../atoms';
import { Row } from '../containers';

const StyledLandingPage = styled.div`
  margin-top: 3rem;
`

export const LandingPage: React.FC = () => (
  <StyledLandingPage>
    <LogoHeader />
    <Row>
      <SearchInput type="text" placeholder="Search courses..." />
      <GoButton />
    </Row>
  </StyledLandingPage>
);

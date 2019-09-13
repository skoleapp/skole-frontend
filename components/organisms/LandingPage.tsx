import React from 'react';
import styled from 'styled-components';
import { LogoHeader } from '../atoms';
import { SearchInputSection, SearchItemShortcutsSection } from '../molecules';

const StyledLandingPage = styled.div`
  margin-top: 3rem;
`;

export const LandingPage: React.FC = () => (
  <StyledLandingPage>
    <LogoHeader />
    <SearchInputSection />
    <SearchItemShortcutsSection />
  </StyledLandingPage>
);

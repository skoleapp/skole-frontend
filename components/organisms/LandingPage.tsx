import React from 'react';
import styled from 'styled-components';
import { LogoHeader } from '../atoms';
import { SearchInputSection, ShortcutsSection } from '../molecules';

const StyledLandingPage = styled.div`
  margin-top: 2rem;
`;

export const LandingPage: React.FC = () => (
  <StyledLandingPage>
    <LogoHeader />
    <SearchInputSection />
    <ShortcutsSection />
  </StyledLandingPage>
);

import React from 'react';
import styled from 'styled-components';
import { actionShortcuts, schoolShortcuts } from '../../static';
import { LogoHeader } from '../atoms';
import { ShortcutsSection } from '../molecules';

const StyledLandingPage = styled.div`
  margin-top: 2rem;
`;

const LandingpageShortcuts = styled.div`
  margin-top: 4rem;
`;

export const LandingPage: React.FC = () => (
  <StyledLandingPage>
    <LogoHeader />
    <LandingpageShortcuts>
      <ShortcutsSection shortcuts={schoolShortcuts} title="Where do you study?" />
      <ShortcutsSection shortcuts={actionShortcuts} title="What would you like to do?" />
    </LandingpageShortcuts>
  </StyledLandingPage>
);

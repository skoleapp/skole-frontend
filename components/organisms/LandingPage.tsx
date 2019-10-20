import React from 'react';
import { H2, LogoHeader } from '../atoms';
import { ShortcutsSection } from '../molecules';

export const LandingPage: React.FC = () => (
  <>
    <LogoHeader />
    <H2>What would you like to do?</H2>
    <ShortcutsSection />
  </>
);

import React from 'react';
import { actionShortcuts, schoolShortcuts } from '../../static';
import { LogoHeader } from '../atoms';
import { ShortcutsSection } from '../molecules';

export const LandingPage: React.FC = () => (
  <>
    <LogoHeader />
    <ShortcutsSection shortcuts={schoolShortcuts} title="Where do you study?" />
    <ShortcutsSection shortcuts={actionShortcuts} title="What would you like to do?" />
  </>
);

import React from 'react';
import { coursesPageShortcuts } from '../../static';
import { H1, H3 } from '../atoms';
import { ShortcutsSection } from '../molecules';

export const CoursesPage: React.FC = () => (
  <>
    <H1>Courses</H1>
    <H3>Where do you study?</H3>
    <ShortcutsSection shortcuts={coursesPageShortcuts} />
  </>
);

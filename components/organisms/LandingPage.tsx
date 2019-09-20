import { Formik } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { landingPageShortcuts, searchCoursesInitialValues } from '../../static';
import { onSubmitSearchCourses } from '../../utils';
import { LogoHeader } from '../atoms';
import { SearchInputSection, ShortcutsSection } from '../molecules';

const StyledLandingPage = styled.div`
  margin-top: 2rem;
`;

export const LandingPage: React.FC = () => {
  return (
    <StyledLandingPage>
      <LogoHeader />
      <Formik
        component={SearchInputSection}
        onSubmit={onSubmitSearchCourses}
        initialValues={searchCoursesInitialValues}
      />
      <ShortcutsSection shortcuts={landingPageShortcuts} />
    </StyledLandingPage>
  );
};

import { Formik } from 'formik';
import Router from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { SearchFormProps } from '../../interfaces';
import { landingPageShortcuts, searchCoursesInitialValues } from '../../static';
import { LogoHeader } from '../atoms';
import { SearchInputSection, ShortcutsSection } from '../molecules';

const StyledLandingPage = styled.div`
  margin-top: 2rem;
`;

const onSubmit = (values: SearchFormProps): void => {
  const { search } = values;
  Router.push({ pathname: '/search', query: { search } });
};

export const LandingPage: React.FC = () => (
  <StyledLandingPage>
    <LogoHeader />
    <Formik
      component={SearchInputSection}
      onSubmit={onSubmit}
      initialValues={searchCoursesInitialValues}
    />
    <ShortcutsSection shortcuts={landingPageShortcuts} />
  </StyledLandingPage>
);

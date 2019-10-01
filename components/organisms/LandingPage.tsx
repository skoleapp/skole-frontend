import { Formik } from 'formik';
import Router from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { SearchFormProps } from '../../interfaces';
import { actionShortcuts, schoolShortcuts } from '../../static';
import { LogoHeader } from '../atoms';
import { SearchInputSection, ShortcutsSection } from '../molecules';

export const initialValues = {
  search: ''
};

const StyledLandingPage = styled.div`
  margin-top: 2rem;
`;

const onSubmit = (values: SearchFormProps): void => {
  const { search } = values;
  Router.push({ pathname: '/search-courses', query: { search } });
};

export const LandingPage: React.FC = () => (
  <StyledLandingPage>
    <LogoHeader />
    <Formik component={SearchInputSection} onSubmit={onSubmit} initialValues={initialValues} />
    <ShortcutsSection shortcuts={schoolShortcuts} title="Where do you study?" />
    <ShortcutsSection shortcuts={actionShortcuts} title="What would you like to do?" />
  </StyledLandingPage>
);

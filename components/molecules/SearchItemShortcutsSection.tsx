import React from 'react';
import styled from 'styled-components';
import { H3, SearchItemShortcut } from '../atoms';

const StyledSearchItemShortcutContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
`;

const StyledShortcutSection = styled.div`
  margin-top: 5rem;
`;

export const SearchItemShortcutsSection: React.FC = () => (
  <StyledShortcutSection>
    <H3>Where do you study?</H3>
    <StyledSearchItemShortcutContainer>
      <SearchItemShortcut
        text="High School"
        iconName="school"
        href={{
          pathname: 'search-schools',
          query: {
            schoolType: 'high-school'
          }
        }}
      />
      <SearchItemShortcut
        text="University"
        iconName="graduation-cap"
        href={{
          pathname: 'search-schools',
          query: {
            schoolType: 'university'
          }
        }}
      />
      <SearchItemShortcut
        text="University of Applied Sciences"
        iconName="chalkboard"
        href={{
          pathname: 'search-schools',
          query: {
            schoolType: 'university-of-applied-sciences'
          }
        }}
      />
    </StyledSearchItemShortcutContainer>
  </StyledShortcutSection>
);

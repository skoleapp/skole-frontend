import React from 'react';
import styled from 'styled-components';
import { H3, Shortcut } from '../atoms';

const StyledShortcutsContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
`;

const StyledShortcutsSection = styled.div`
  margin-top: 5rem;
`;

export const ShortcutsSection: React.FC = () => (
  <StyledShortcutsSection>
    <H3>Where do you study?</H3>
    <StyledShortcutsContainer>
      <Shortcut
        text="High School"
        iconName="school"
        href={{
          pathname: 'search-schools',
          query: {
            schoolType: 'high-school'
          }
        }}
      />
      <Shortcut
        text="University"
        iconName="graduation-cap"
        href={{
          pathname: 'search-schools',
          query: {
            schoolType: 'university'
          }
        }}
      />
      <Shortcut
        text="University of Applied Sciences"
        iconName="chalkboard"
        href={{
          pathname: 'search-schools',
          query: {
            schoolType: 'university-of-applied-sciences'
          }
        }}
      />
    </StyledShortcutsContainer>
  </StyledShortcutsSection>
);

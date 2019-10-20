import React from 'react';
import styled from 'styled-components';
import { Shortcut } from '../atoms';

const StyledShortcutsContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  margin-top: 2rem;
`;

export const ShortcutsSection: React.FC = () => (
  <StyledShortcutsContainer>
    <Shortcut text="Search Courses" iconName="chalkboard-teacher" href="/school" />
    <Shortcut text="Upload Resource" iconName="sticky-note" href="/upload-resource" />
    <Shortcut text="Create Course" iconName="plus-circle" href="/create-course" />
    <Shortcut text="Leaderboard" iconName="star-half-alt" href="/user" />
  </StyledShortcutsContainer>
);

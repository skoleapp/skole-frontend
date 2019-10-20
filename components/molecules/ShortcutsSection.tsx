import { Backup, School, Stars } from '@material-ui/icons';
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
    <Shortcut text="Search Courses" icon={School} href="/school" />
    <Shortcut text="Upload Resource" icon={Backup} href="/upload-resource" />
    <Shortcut text="Create Course" icon={Backup} href="/create-course" />
    <Shortcut text="Leaderboard" icon={Stars} href="/user" />
  </StyledShortcutsContainer>
);

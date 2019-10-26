import { Typography } from '@material-ui/core';
import { Backup, LibraryAdd, School, Stars } from '@material-ui/icons';
import React from 'react';
import styled from 'styled-components';
import { Shortcut } from '../atoms';

const StyledLandingPageContent = styled.div`
  h5 {
    margin: 1rem 0;
  }

  .shortcuts {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    margin-top: 2rem;
  }
`;

export const LandingPageContent: React.FC = () => (
  <StyledLandingPageContent>
    <Typography variant="h5">What would you like to do?</Typography>
    <div className="shortcuts">
      <Shortcut text="Search Courses" icon={School} href="/school" />
      <Shortcut text="Upload Resource" icon={Backup} href="/upload-resource" />
      <Shortcut text="Create Course" icon={LibraryAdd} href="/create-course" />
      <Shortcut text="Leaderboard" icon={Stars} href="/user" />
    </div>
  </StyledLandingPageContent>
);

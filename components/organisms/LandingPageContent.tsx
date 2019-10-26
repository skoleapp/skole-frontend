import { Typography } from '@material-ui/core';
import { Backup, LibraryAdd, School, Stars } from '@material-ui/icons';
import React from 'react';
import styled from 'styled-components';
import { SM } from '../../utils';
import { Shortcut } from '../atoms';

const StyledLandingPageContent = styled.div`
  h3 {
    margin: 1rem 0;

    @media only screen and (max-width: ${SM}) {
      font-size: 2.5rem;
    }
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
    <Typography variant="h3">What would you like to do?</Typography>
    <div className="shortcuts">
      <Shortcut text="Search Courses" icon={School} href="/school" />
      <Shortcut text="Upload Resource" icon={Backup} href="/upload-resource" />
      <Shortcut text="Create Course" icon={LibraryAdd} href="/create-course" />
      <Shortcut text="Leaderboard" icon={Stars} href="/user" />
    </div>
  </StyledLandingPageContent>
);

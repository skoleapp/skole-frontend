import { Typography } from '@material-ui/core';
import {
  Assessment,
  Backup,
  House,
  LibraryAddSharp,
  School,
  Score,
  Subject
} from '@material-ui/icons';
import { NextPage } from 'next';
import React from 'react';
import styled from 'styled-components';
import { Shortcut } from '../components';
import { Layout } from '../containers';
import { withAuthSync } from '../utils';

const IndexPage: NextPage = () => (
  <Layout title="Home">
    <StyledLandingPageContent>
      <Typography variant="h5">What would you like to do?</Typography>
      <div className="shortcuts">
        <Shortcut text="Search Courses" icon={School} href="/search" />
        <Shortcut text="Upload Resource" icon={Backup} href="/upload-resource" />
        <Shortcut text="Create Course" icon={LibraryAddSharp} href="/create-course" />
        <Shortcut text="Browse Schools" icon={House} href="/school" />
        <Shortcut text="Browse Courses" icon={Assessment} href="/course" />
        <Shortcut text="Browse Subjects" icon={Subject} href="/subject" />
        <Shortcut text="Leaderboard" icon={Score} href="/user" />
        <Shortcut text="???" href="/" />
      </div>
    </StyledLandingPageContent>
  </Layout>
);

const StyledLandingPageContent = styled.div`
  h5 {
    margin: 2rem 0;
  }

  .shortcuts {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
  }
`;

export default withAuthSync(IndexPage);

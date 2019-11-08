import { Typography } from '@material-ui/core';
import { Backup, LibraryAddSharp, School, Stars } from '@material-ui/icons';
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
        <Shortcut text="Search Courses" icon={School} href="/school" />
        <Shortcut text="Upload Resource" icon={Backup} href="/upload-resource" />
        <Shortcut text="Create Course" icon={LibraryAddSharp} href="/create-course" />
        <Shortcut text="Leaderboard" icon={Stars} href="/user" />
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

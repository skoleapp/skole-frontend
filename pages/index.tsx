import { Typography } from '@material-ui/core';
import { House, LibraryAddSharp, Score } from '@material-ui/icons';
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
        <Shortcut text="Browse Schools" icon={House} href="/schools" />
        <Shortcut text="Create Course" icon={LibraryAddSharp} href="/create-course" />
        <Shortcut text="Leaderboard" icon={Score} href="/users" />
      </div>
    </StyledLandingPageContent>
  </Layout>
);

const StyledLandingPageContent = styled.div`
  h5 {
    margin: 1rem 0;
  }

  .shortcuts {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
  }
`;

export default withAuthSync(IndexPage);

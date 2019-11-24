import { Box, Grid, Typography } from '@material-ui/core';
import {
  CloudUploadOutlined,
  HouseOutlined,
  LibraryAddOutlined,
  SchoolOutlined,
  ScoreOutlined,
  SubjectOutlined
} from '@material-ui/icons';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import styled from 'styled-components';
import { ButtonLink, Layout, Shortcut } from '../components';
import { SkoleContext } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useAuthSync } from '../utils';

const IndexPage: NextPage = () => (
  <Layout title="Home">
    <Box marginY="1rem">
      <Typography variant="h5">Learn with Skole community!</Typography>
    </Box>
    <Grid container>
      <ShortcutsRow item xs={12}>
        <Shortcut text="Courses" icon={SchoolOutlined} href="/courses" />
        <Shortcut text="Schools" icon={HouseOutlined} href="/schools" />
        <Shortcut text="Subjects" icon={SubjectOutlined} href="/subjects" />
      </ShortcutsRow>
      <ShortcutsRow item xs={12}>
        <Shortcut text="Upload Resource" icon={CloudUploadOutlined} href="/upload-resource" />
        <Shortcut text="Create Course" icon={LibraryAddOutlined} href="/create-course" />
        <Shortcut text="Leaderboard" icon={ScoreOutlined} href="/leaderboard" />
      </ShortcutsRow>
    </Grid>
    <Box marginY="1rem">
      <Typography variant="h6" gutterBottom>
        Is your school or subject not listed?
      </Typography>
      <ButtonLink href="/contact" variant="contained" color="primary">
        Contact us!
      </ButtonLink>
    </Box>
  </Layout>
);

const ShortcutsRow = styled(Grid)`
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
`;

IndexPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return {};
};

export default compose(withRedux, withApollo)(IndexPage);

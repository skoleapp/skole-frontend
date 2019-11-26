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
      <Grid item xs={12}>
        <Box className="flex-flow" display="flex" justifyContent="center">
          <Shortcut text="Courses" icon={SchoolOutlined} href="/courses" />
          <Shortcut text="Schools" icon={HouseOutlined} href="/schools" />
          <Shortcut text="Subjects" icon={SubjectOutlined} href="/subjects" />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box className="flex-flow" display="flex" justifyContent="center">
          <Shortcut text="Upload Resource" icon={CloudUploadOutlined} href="/upload-resource" />
          <Shortcut text="Create Course" icon={LibraryAddOutlined} href="/create-course" />
          <Shortcut text="Leaderboard" icon={ScoreOutlined} href="/leaderboard" />
        </Box>
      </Grid>
    </Grid>
    <Box marginY="1rem">
      <Typography variant="h6" gutterBottom>
        Is your school or subject not listed?
      </Typography>
      <ButtonLink href="/contact" variant="outlined" color="primary">
        Contact us!
      </ButtonLink>
    </Box>
  </Layout>
);

IndexPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return {};
};

export default compose(withRedux, withApollo)(IndexPage);

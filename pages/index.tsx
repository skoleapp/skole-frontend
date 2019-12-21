import { Box, Grid, Typography } from '@material-ui/core';
import {
  CloudUploadOutlined,
  LibraryAddOutlined,
  SchoolOutlined,
  SupervisedUserCircleOutlined
} from '@material-ui/icons';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { ButtonLink, LandingPageSearchWidget, Layout, Shortcut } from '../components';
import { SkoleContext } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useAuthSync } from '../utils';

const IndexPage: NextPage = () => (
  <Layout title="Home" disableSearch>
    <Box marginY="1rem">
      <Typography variant="h5">Co-learn with Skole platform!</Typography>
    </Box>
    <Box marginY="2rem">
      <LandingPageSearchWidget />
    </Box>
    <Grid container>
      <Grid item xs={12}>
        <Box className="flex-flow" display="flex" justifyContent="center">
          <Shortcut text="Browse Courses" icon={SchoolOutlined} href="/search" />
          <Shortcut text="Upload Resource" icon={CloudUploadOutlined} href="/upload-resource" />
          <Shortcut text="Create Course" icon={LibraryAddOutlined} href="/create-course" />
          <Shortcut text="Users" icon={SupervisedUserCircleOutlined} href="/users" />
        </Box>
      </Grid>
    </Grid>
    <Box marginY="1rem">
      <Typography variant="h6" gutterBottom>
        Is your school or subject not listed?
      </Typography>
      <ButtonLink href="/contact" variant="outlined" color="primary">
        contact us!
      </ButtonLink>
    </Box>
  </Layout>
);

IndexPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return {};
};

export default compose(withRedux, withApollo)(IndexPage);

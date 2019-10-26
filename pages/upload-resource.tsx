import { Typography } from '@material-ui/core';
import React from 'react';
import { Layout } from '../components';
import { withAuth } from '../lib';

const UploadResourcePage: React.FC = () => (
  <Layout title="Upload Resource">
    <Typography variant="h5">Upload Resource</Typography>
  </Layout>
);

export default withAuth(UploadResourcePage);

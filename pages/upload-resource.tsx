import { Typography } from '@material-ui/core';
import React from 'react';
import { Layout } from '../containers';
import { withAuthSync } from '../utils';

const UploadResourcePage: React.FC = () => (
  <Layout title="Upload Resource">
    <Typography variant="h5">Upload Resource</Typography>
  </Layout>
);

export default withAuthSync(UploadResourcePage);

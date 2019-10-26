import { Typography } from '@material-ui/core';
import React from 'react';
import { MainLayout } from '../components';
import { withAuth } from '../lib';

const UploadResourcePage: React.FC = () => (
  <MainLayout title="Upload Resource">
    <Typography variant="h3">Upload Resource</Typography>
  </MainLayout>
);

export default withAuth(UploadResourcePage);

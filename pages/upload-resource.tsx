import React from 'react';
import { H1, MainLayout } from '../components';
import { withApollo } from '../lib';

const UploadResourcePage: React.FC = () => (
  <MainLayout title="Upload Resource">
    <H1>Upload Resource</H1>
  </MainLayout>
);

export default withApollo(UploadResourcePage);

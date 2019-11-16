import { Typography } from '@material-ui/core';
import React from 'react';
import { StyledCard } from '../../../components';
import { Layout } from '../../../containers';
import { withAuthSync } from '../../../utils';

const UploadResourcePage: React.FC = () => (
  <Layout title="Upload Resource">
    <StyledCard>
      <Typography variant="h5">Upload Resource</Typography>
    </StyledCard>
  </Layout>
);

export default withAuthSync(UploadResourcePage);

import React from 'react';
import { StyledCard } from '../../../components';
import { Layout } from '../../../containers';
import { withAuthSync } from '../../../utils';

const UploadResourcePage: React.FC = () => (
  <Layout title="Upload Resource">
    <StyledCard>Here will be upload resource...</StyledCard>
  </Layout>
);

export default withAuthSync(UploadResourcePage);

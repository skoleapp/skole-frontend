import { CardContent, CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout, StyledCard } from '../components';

const TermsPage: NextPage = () => (
  <Layout title="Terms" heading="Terms" backUrl>
    <StyledCard>
      <CardHeader title="Skole Terms and Conditions" />
      <CardContent>Here will be Terms and Conditions...</CardContent>
    </StyledCard>
  </Layout>
);

export default TermsPage;

import { CardContent, CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout, StyledCard } from '../../components';

const ForgotPasswordPage: NextPage = () => (
  <Layout title="Forgot Password?" backUrl>
    <StyledCard>
      <CardHeader title="Forgot Password?" />
      <CardContent>Here will be forgot password form...</CardContent>
    </StyledCard>
  </Layout>
);

export default ForgotPasswordPage;

import { CardContent, CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout, StyledCard } from '../../components';

const ResetPasswordPage: NextPage = () => (
  <Layout title="Reset Password?" backUrl>
    <StyledCard>
      <CardHeader title="Forgot Password?" />
      <CardContent>Here will be reset password content...</CardContent>
    </StyledCard>
  </Layout>
);

export default ResetPasswordPage;

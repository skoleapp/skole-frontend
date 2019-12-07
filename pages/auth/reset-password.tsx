import { CardContent, CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { Layout, StyledCard } from '../../components';
import { withApollo, withRedux } from '../../lib';

const ResetPasswordPage: NextPage = () => (
  <Layout title="Reset Password?" backUrl="/auth/login">
    <StyledCard>
      <CardHeader title="Forgot Password?" />
      <CardContent>Here will be reset password content...</CardContent>
    </StyledCard>
  </Layout>
);

export default compose(withApollo, withRedux)(ResetPasswordPage);

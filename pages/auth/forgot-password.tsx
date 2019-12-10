import { CardContent, CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { Layout, StyledCard } from '../../components';
import { withApollo, withRedux } from '../../lib';
import { withTranslation } from '../../i18n';

interface Props {
  t: (value: string) => any;
}

const ForgotPasswordPage: NextPage<Props> = ({ t }) => (
  <Layout t={t} title="Forgot Password?" backUrl="/auth/login">
    <StyledCard>
      <CardHeader title="Forgot Password?" />
      <CardContent>Here will be forgot password form...</CardContent>
    </StyledCard>
  </Layout>
);

export default compose(withRedux, withApollo, withTranslation('common'))(ForgotPasswordPage);

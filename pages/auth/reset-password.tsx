import { CardContent, CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { Layout, StyledCard } from '../../components';
import { withApollo, withRedux } from '../../lib';
import { withTranslation } from '../../i18n';

const ResetPasswordPage: NextPage = ({ t }: any) => (
  <Layout t={t} title={t('titleResetPassword')} backUrl="/auth/login">
    <StyledCard>
      <CardHeader title={t('headerResetPassword')} />
      <CardContent>Here will be a reset password form...</CardContent>
    </StyledCard>
  </Layout>
);

export default compose(withRedux, withApollo, withTranslation('common'))(ResetPasswordPage);

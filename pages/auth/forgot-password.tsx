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
  <Layout t={t} title={t('titleForgotPassword')} backUrl="/auth/login">
    <StyledCard>
      <CardHeader title={t('headerForgotPassword')} />
      <CardContent>
        Forgot your password form will be chilling here someday in year 2021...
      </CardContent>
    </StyledCard>
  </Layout>
);

export default compose(withRedux, withApollo, withTranslation('common'))(ForgotPasswordPage);

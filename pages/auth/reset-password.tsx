import { CardContent, CardHeader } from '@material-ui/core';
import React from 'react';
import { compose } from 'redux';
import { Layout, StyledCard } from '../../components';
import { includeDefaultNamespaces, useTranslation } from '../../i18n';
import { I18nPage, I18nProps } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';

const ResetPasswordPage: I18nPage = () => {
  const { t } = useTranslation();

  return (
    <Layout title={t('common:resetPassword')} backUrl>
      <StyledCard>
        <CardHeader title={t('common:resetPassword')} />
        <CardContent>Here will be reset password content...</CardContent>
      </StyledCard>
    </Layout>
  );
};

ResetPasswordPage.getInitialProps = (): I18nProps => {
  return {
    namespacesRequired: includeDefaultNamespaces([])
  };
};

export default compose(withApollo, withRedux)(ResetPasswordPage);

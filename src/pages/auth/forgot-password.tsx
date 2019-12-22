import { CardContent, CardHeader } from '@material-ui/core';
import React from 'react';
import { compose } from 'redux';
import { Layout, StyledCard } from '../../components';
import { includeDefaultNamespaces, useTranslation } from '../../i18n';
import { I18nPage, I18nProps, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { usePublicPage } from '../../utils';

const ForgotPasswordPage: I18nPage = () => {
  const { t } = useTranslation();

  return (
    <Layout title={t('common:forgotPassword')} backUrl>
      <StyledCard>
        <CardHeader title={t('common:forgotPassword')} />
        <CardContent>Here will be forgot password form...</CardContent>
      </StyledCard>
    </Layout>
  );
};

ForgotPasswordPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
  await usePublicPage(ctx);

  return {
    namespacesRequired: includeDefaultNamespaces([])
  };
};

export default compose(withApollo, withRedux)(ForgotPasswordPage);

import { CardContent, CardHeader } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';
import { Layout, StyledCard } from '../components';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useAuthSync } from '../utils';

const PrivacyPage: I18nPage = () => {
  const { t } = useTranslation();

  return (
    <Layout title={t('privacy:title')} backUrl>
      <StyledCard>
        <CardHeader title={t('privacy:title')} />
        <CardContent>Here will be privacy policy...</CardContent>
      </StyledCard>
    </Layout>
  );
};

PrivacyPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
  await useAuthSync(ctx);

  return {
    namespacesRequired: includeDefaultNamespaces(['privacy'])
  };
};

export default compose(withRedux, withApollo)(PrivacyPage);

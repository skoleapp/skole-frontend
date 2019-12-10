import { CardContent, CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { Layout, StyledCard } from '../components';
import { withApollo, withRedux } from '../lib';
import { withTranslation } from '../i18n';

const TermsPage: NextPage = ({ t }: any) => (
  <Layout t={t} title={t('headerTerms')} heading={t('headerTerms')} backUrl="/">
    <StyledCard>
      <CardHeader title={t('headerSkoleTermsAndConditions')} />
      <CardContent>
        By using Skole you pinky swear that you will not post anything naughty
      </CardContent>
    </StyledCard>
  </Layout>
);

export default compose(withRedux, withApollo, withTranslation('common'))(TermsPage);

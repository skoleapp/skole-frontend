import { CardContent, CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { Layout, StyledCard } from '../components';
import { withApollo, withRedux } from '../lib';
import { withTranslation } from '../i18n';

const PrivacyPage: NextPage = () => (
  <Layout title="Privacy" heading="Privacy" backUrl="/">
    <StyledCard>
      <CardHeader title="Skole Privacy Policy" />
      <CardContent>Here will be privacy policy...</CardContent>
    </StyledCard>
  </Layout>
);

export default compose(withRedux, withApollo, withTranslation('common'))(PrivacyPage);

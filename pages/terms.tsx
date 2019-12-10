import { CardContent, CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { Layout, StyledCard } from '../components';
import { withApollo, withRedux } from '../lib';
import { withTranslation } from '../i18n';

const TermsPage: NextPage = ({ t }: any) => (
  <Layout t={t} title="Terms" heading="Terms" backUrl="/">
    <StyledCard>
      <CardHeader title="Skole Terms and Conditions" />
      <CardContent>Here will be Terms and Conditions...</CardContent>
    </StyledCard>
  </Layout>
);

export default compose(withRedux, withApollo, withTranslation('common'))(TermsPage);

import { CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { Layout, SlimCardContent, StyledCard } from '../components';
import { SkoleContext } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useAuthSync } from '../utils';
import { withTranslation } from '../i18n';

const SearchPage: NextPage = ({ t }: any) => (
  <Layout t={t} heading={t('headingSearch')} title={t('titleSearch')} backUrl="/">
    <StyledCard>
      <CardHeader title={t('headerSearch')} />
      <SlimCardContent>Here will be search results...</SlimCardContent>
    </StyledCard>
  </Layout>
);

SearchPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return { namespacesRequired: ['common'] };
};

export default compose(withRedux, withApollo, withTranslation('common'))(SearchPage);

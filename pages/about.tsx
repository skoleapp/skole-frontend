import { CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { Layout, SlimCardContent, StyledCard } from '../components';
import { SkoleContext } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useAuthSync } from '../utils';
import { withTranslation } from '../i18n';

interface Props {
  t: (value: string) => any;
}

const AboutPage: NextPage<Props> = ({ t }) => (
  <Layout t={t} heading="About" title={t('titleAbout')} backUrl="/">
    <StyledCard>
      <CardHeader title={t('titleAbout')} />
      <SlimCardContent>About about about about.</SlimCardContent>
    </StyledCard>
  </Layout>
);

AboutPage.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
  await useAuthSync(ctx);
  return { namespacesRequired: ['common'] };
};

export default compose(withRedux, withApollo, withTranslation('common'))(AboutPage);

import { LandingPageTemplate, LoadingTemplate } from 'components';
import { useAuthContext } from 'context';
import { withUserMe } from 'hocs';
import { useMediaQueries } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router from 'next/router';
import React, { useEffect } from 'react';
import { urls } from 'utils';

const LandingPage: NextPage = () => {
  const { t } = useTranslation();
  const { userMe } = useAuthContext();
  const { smDown } = useMediaQueries();

  // Redirect authenticated users to home page.
  useEffect(() => {
    if (userMe) {
      Router.replace(urls.home);
    }
  }, [userMe]);

  const layoutProps = {
    seoProps: {
      description: t('index:description'),
    },
    topNavbarProps: {
      hideLogo: smDown,
    },
  };

  // Show loading screen when redirecting to home page.
  if (userMe) {
    return <LoadingTemplate />;
  }

  return <LandingPageTemplate {...layoutProps} />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['index'], locale),
  },
});

export default withUserMe(LandingPage);

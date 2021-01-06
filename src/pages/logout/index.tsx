import { useApolloClient } from '@apollo/client';
import { FormControl, Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import {
  ButtonLink,
  ErrorTemplate,
  FormTemplate,
  LoadingTemplate,
  OfflineTemplate,
} from 'components';
import { useGraphQlLogoutMutation } from 'generated';
import { withUserMe } from 'hocs';
import { useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { urls } from 'utils';

const LogoutPage: NextPage = () => {
  const apolloClient = useApolloClient();
  const { t } = useTranslation();
  const { query } = useRouter();
  const context = useLanguageHeaderContext();
  const [logout, { loading, error }] = useGraphQlLogoutMutation({ context });

  useEffect(() => {
    (async (): Promise<void> => {
      await logout();
      await apolloClient.clearStore();
      localStorage.setItem('logout', String(Date.now()));
      !!query.next && (await Router.push(String(query.next))); // Automatically redirect to the next page if one has been provided as a query parameter.
    })();
  }, []);

  const layoutProps = {
    seoProps: {
      title: t('logout:title'),
      description: t('logout:description'),
    },
    header: t('logout:header'),
    disableBottomNavbar: true,
    topNavbarProps: {
      disableAuthButtons: true,
      disableForEducatorsButton: true,
      disableSearch: true,
    },
  };

  // Show loading screen when loading the next page that the user will be automatically redirected to.
  if (loading || !!query.next) {
    return <LoadingTemplate />;
  }

  if (!!error && !!error.networkError) {
    return <OfflineTemplate />;
  }

  if (error) {
    return <ErrorTemplate />;
  }

  return (
    <FormTemplate {...layoutProps}>
      <Typography variant="subtitle1" align="center">
        {t('logout:loggedOut')}
      </Typography>
      <Typography component="br" />
      <ButtonLink
        href={urls.login}
        color="primary"
        variant="contained"
        endIcon={<ArrowForwardOutlined />}
        fullWidth
      >
        {t('logout:logInAgain')}
      </ButtonLink>
      <FormControl>
        <ButtonLink href={urls.home} color="primary" variant="outlined" fullWidth>
          {t('common:backToHome')}
        </ButtonLink>
      </FormControl>
    </FormTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['logout'], locale),
  },
});

export default withUserMe(LogoutPage);

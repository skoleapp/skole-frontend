import { useApolloClient } from '@apollo/client';
import { FormControl, Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { BackButton, ButtonLink, ErrorTemplate, FormTemplate, LoadingTemplate } from 'components';
import { useAuthContext } from 'context';
import { useGraphQlLogoutMutation } from 'generated';
import { withUserMe } from 'hocs';
import { useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { LS_LOGOUT_KEY, urls } from 'utils';

const LogoutPage: NextPage = () => {
  const apolloClient = useApolloClient();
  const { t } = useTranslation();
  const { query } = useRouter();
  const { setUserMe } = useAuthContext();
  const context = useLanguageHeaderContext();

  const onCompleted = async (): Promise<void> => {
    await apolloClient.clearStore();
    setUserMe(null);
    localStorage.setItem(LS_LOGOUT_KEY, String(Date.now()));
    !!query.next && (await Router.push(String(query.next))); // Automatically redirect to the next page if one has been provided as a query parameter.
  };

  const [logout, { loading, error }] = useGraphQlLogoutMutation({ context, onCompleted });

  useEffect(() => {
    logout();
  }, []);

  const layoutProps = {
    seoProps: {
      title: t('logout:title'),
    },
    hideBottomNavbar: true,
    topNavbarProps: {
      renderBackButton: <BackButton />,
      header: t('logout:header'),
      hideSearch: true,
    },
  };

  // Show loading screen when loading the next page that the user will be automatically redirected to.
  if (loading || !!query.next) {
    return <LoadingTemplate />;
  }

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" />;
  }

  if (error) {
    return <ErrorTemplate variant="error" />;
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

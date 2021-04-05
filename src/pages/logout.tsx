import { useApolloClient } from '@apollo/client';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import { ButtonLink, ErrorTemplate, FormTemplate, LoadingTemplate } from 'components';
import { useAuthContext } from 'context';
import { useGraphQlLogoutMutation } from 'generated';
import { withAuthRequired } from 'hocs';
import { useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import { LS_LOGOUT_KEY, urls } from 'utils';

const LogoutPage: NextPage = () => {
  const apolloClient = useApolloClient();
  const { t } = useTranslation();
  const { query } = useRouter();
  const { userMe, setUserMe } = useAuthContext();
  const context = useLanguageHeaderContext();

  const onCompleted = async (): Promise<void> => {
    await apolloClient.clearStore();
    setUserMe(null);
    localStorage.setItem(LS_LOGOUT_KEY, String(Date.now()));

    if (query.next) {
      await Router.push(String(query.next)); // Automatically redirect to the next page if one has been provided as a query parameter.
    }
  };

  const [logout, { loading, error }] = useGraphQlLogoutMutation({ context, onCompleted });

  useEffect(() => {
    logout();
  }, [logout]);

  const renderLoggedOutText = useMemo(
    () => (
      <FormControl>
        <Typography variant="subtitle1" align="center">
          {t('logout:loggedOut')}
        </Typography>
      </FormControl>
    ),
    [t],
  );

  const renderLoginAgainButton = useMemo(
    () => (
      <FormControl>
        <ButtonLink
          href={urls.login}
          color="primary"
          variant="contained"
          endIcon={<ArrowForwardOutlined />}
        >
          {t('logout:logInAgain')}
        </ButtonLink>
      </FormControl>
    ),
    [t],
  );

  const layoutProps = {
    seoProps: {
      title: t('logout:title'),
    },
    topNavbarProps: {
      header: t('logout:header'),
      emoji: '👋',
      hideSearch: true,
    },
    hideBottomNavbar: !userMe,
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
      {renderLoggedOutText}
      {renderLoginAgainButton}
    </FormTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['logout'], locale),
  },
});

export default withAuthRequired(LogoutPage);

import { useApolloClient } from '@apollo/client';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import { ButtonLink, ErrorTemplate, FormTemplate, LoadingTemplate } from 'components';
import { useAuthContext } from 'context';
import { useGraphQlLogoutMutation } from 'generated';
import { withUserMe } from 'hocs';
import { useLanguageHeaderContext } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { SeoPageProps } from 'types';
import { LS_LOGOUT_KEY, urls } from 'utils';

const LogoutPage: NextPage<SeoPageProps> = ({ seoProps }) => {
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
    seoProps,
    hideBottomNavbar: true,
    topNavbarProps: {
      header: t('logout:header'),
      emoji: '👋',
      hideSearch: true,
    },
  };

  // Show loading screen when loading the next page that the user will be automatically redirected to.
  if (loading || !!query.next) {
    return <LoadingTemplate seoProps={seoProps} />;
  }

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" seoProps={seoProps} />;
  }

  if (error) {
    return <ErrorTemplate variant="error" seoProps={seoProps} />;
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const t = await getT(locale, 'logout');

  return {
    props: {
      _ns: await loadNamespaces(['logout'], locale),
      seoProps: {
        title: t('title'),
      },
    },
  };
};

export default withUserMe(LogoutPage);

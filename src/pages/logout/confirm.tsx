import { Button, FormControl, Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { ButtonLink, FormTemplate } from 'components';
import { withAuth } from 'hocs';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React from 'react';
import { urls } from 'utils';

const ConfirmLogoutPage: NextPage = () => {
  const { t } = useTranslation();
  const { query } = useRouter();
  const handleClickCancelButton = (): void => Router.back();

  const layoutProps = {
    seoProps: {
      title: t('confirm-logout:title'),
      description: t('confirm-logout:description'),
    },
    header: t('confirm-logout:header'),
    topNavbarProps: {
      disableAuthButtons: true,
      disableSearch: true,
    },
  };

  return (
    <FormTemplate {...layoutProps}>
      <Typography variant="subtitle1" align="center">
        {t('confirm-logout:confirmLogout')}
      </Typography>
      <Typography component="br" />
      <ButtonLink
        href={{ pathname: urls.logout, query }}
        color="primary"
        variant="contained"
        endIcon={<ArrowForwardOutlined />}
        fullWidth
      >
        {t('common:confirm')}
      </ButtonLink>
      <FormControl>
        <Button
          onClick={handleClickCancelButton}
          color="primary"
          variant="outlined"
          fullWidth
        >
          {t('common:cancel')}
        </Button>
      </FormControl>
    </FormTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['confirm-logout'], locale),
  },
});

export default withAuth(ConfirmLogoutPage);

import { Typography } from '@material-ui/core';
import { SettingsTemplate } from 'components';
import { withUserMe } from 'hocs';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';

const TermsPage: NextPage = () => {
  const { t } = useTranslation();

  const layoutProps = {
    seoProps: {
      title: t('terms:title'),
      description: t('terms:description'),
    },
    header: t('terms:header'),
    dense: true,
    topNavbarProps: {
      dynamicBackUrl: true,
    },
  };

  return (
    <SettingsTemplate {...layoutProps}>
      <Typography variant="body2">{t('terms:content')}</Typography>
    </SettingsTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['terms'], locale),
  },
});

export default withUserMe(TermsPage);

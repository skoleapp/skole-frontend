import { Typography } from '@material-ui/core';
import { SettingsTemplate } from 'components';
import { withUserMe } from 'hocs';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';

const PrivacyPage: NextPage = () => {
  const { t } = useTranslation();

  const layoutProps = {
    seoProps: {
      title: t('privacy:title'),
      description: t('privacy:description'),
    },
    header: t('privacy:header'),
    dense: true,
    topNavbarProps: {
      dynamicBackUrl: true,
    },
  };

  return (
    <SettingsTemplate {...layoutProps}>
      <Typography variant="body2">{t('privacy:content')}</Typography>
    </SettingsTemplate>
  );
};
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['privacy'], locale),
  },
});

export default withUserMe(PrivacyPage);

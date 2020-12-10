import { SettingsTemplate } from 'components';
import { withUserMe } from 'hocs';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import ReactMarkdown from 'react-markdown';
// @ts-ignore: TS cannot detect markdown files by default.
import privacy from '../privacy.md'; // TODO: See if this can be imported via absolute path.

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
      <ReactMarkdown source={privacy} />
    </SettingsTemplate>
  );
};
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['privacy'], locale),
  },
});

export default withUserMe(PrivacyPage);

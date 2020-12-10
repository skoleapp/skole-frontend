import { SettingsTemplate } from 'components';
import { withUserMe } from 'hocs';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import terms from '../terms.md'; // TODO: See if this can be imported via absolute path.

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
      <ReactMarkdown source={terms} />
    </SettingsTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['terms'], locale),
  },
});

export default withUserMe(TermsPage);

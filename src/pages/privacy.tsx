import { BackButton, MarkdownTemplate } from 'components';
import { withUserMe } from 'hocs';
import { loadMarkdownContent, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { MarkdownPageProps } from 'types';

const PrivacyPage: NextPage<MarkdownPageProps> = ({ content }) => {
  const { t } = useTranslation();

  const layoutProps = {
    seoProps: {
      title: t('privacy:title'),
      description: t('privacy:description'),
    },
    topNavbarProps: {
      renderBackButton: <BackButton />,
      header: 'Privacy Policy',
    },
  };

  return <MarkdownTemplate {...layoutProps}>{content}</MarkdownTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['privacy'], locale),
    content: await loadMarkdownContent('privacy'),
  },
});

export default withUserMe(PrivacyPage as NextPage);

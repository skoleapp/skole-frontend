import { MarkdownTemplate } from 'components';
import { withUserMe } from 'hocs';
import { loadNamespaces, useTranslation } from 'lib';
import { loadMarkdown } from 'markdown';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { MarkdownPageProps } from 'types';

const PrivacyPage: NextPage<MarkdownPageProps> = ({
  data: { title },
  content: markdownContent,
}) => {
  const { t } = useTranslation();

  const layoutProps = {
    seoProps: {
      title: t('privacy:title'),
      description: t('privacy:description'),
    },
    topNavbarProps: {
      header: title,
      emoji: '🔒',
      hideLanguageButton: true,
    },
    markdownContent,
  };

  return <MarkdownTemplate {...layoutProps} />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const _ns = await loadNamespaces(['privacy'], locale);
  const { data, content } = await loadMarkdown('privacy');

  return {
    props: {
      _ns,
      data,
      content,
    },
  };
};

export default withUserMe(PrivacyPage);

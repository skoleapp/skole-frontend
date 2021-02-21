import { MarkdownTemplate } from 'components';
import { withUserMe } from 'hocs';
import { getT, loadNamespaces } from 'lib';
import { loadMarkdown } from 'markdown';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { MarkdownPageProps } from 'types';

const PrivacyPage: NextPage<MarkdownPageProps> = ({
  seoProps,
  data: { title },
  content: markdownContent,
}) => {
  const layoutProps = {
    seoProps,
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
  const t = await getT(locale, 'privacy');

  const seoProps = {
    title: t('title'),
    description: t('description'),
  };

  const { data, content } = await loadMarkdown('privacy');

  return {
    props: {
      _ns,
      seoProps,
      data,
      content,
    },
  };
};

export default withUserMe(PrivacyPage);

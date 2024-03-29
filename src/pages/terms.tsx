import { MarkdownTemplate } from 'components';
import { withUserMe } from 'hocs';
import { loadNamespaces, useTranslation } from 'lib';
import { loadMarkdown } from 'markdown';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { MarkdownPageProps } from 'types';

const TermsPage: NextPage<MarkdownPageProps> = ({ data: { title }, content: markdownContent }) => {
  const { t } = useTranslation();

  const layoutProps = {
    seoProps: {
      title: t('terms:title'),
      description: t('terms:description'),
    },
    topNavbarProps: {
      header: title,
      emoji: '🧑‍⚖️',
      hideLanguageButton: true,
    },
    markdownContent,
  };

  return <MarkdownTemplate {...layoutProps} />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const _ns = await loadNamespaces(['terms'], locale);
  const { data, content } = await loadMarkdown('terms');

  return {
    props: {
      _ns,
      data,
      content,
    },
  };
};

export default withUserMe(TermsPage);

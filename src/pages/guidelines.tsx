import { MarkdownTemplate } from 'components';
import { withUserMe } from 'hocs';
import { getT, loadNamespaces } from 'lib';
import { loadMarkdown } from 'markdown';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { MarkdownPageProps } from 'types';

const GuidelinesPage: NextPage<MarkdownPageProps> = ({
  seoProps,
  data: { title },
  content: markdownContent,
}) => {
  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: title,
      emoji: '🗺️',
    },
    markdownContent,
  };

  return <MarkdownTemplate {...layoutProps} />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const _ns = await loadNamespaces(['guidelines'], locale);
  const t = await getT(locale, 'guidelines');

  const seoProps = {
    title: t('title'),
    description: t('description'),
  };

  const { data, content } = await loadMarkdown('guidelines', locale);

  return {
    props: {
      _ns,
      seoProps,
      data,
      content,
    },
  };
};

export default withUserMe(GuidelinesPage);

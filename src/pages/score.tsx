import { MarkdownTemplate } from 'components';
import { withUserMe } from 'hocs';
import { getT, loadMarkdown, loadNamespaces } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { MarkdownPageProps } from 'types';

const ScorePage: NextPage<MarkdownPageProps> = ({ seoProps, data: { title }, content }) => {
  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: title,
    },
    content,
  };

  return <MarkdownTemplate {...layoutProps} />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const _ns = await loadNamespaces(['score'], locale);
  const t = await getT(locale, 'score');

  const seoProps = {
    title: t('title'),
    description: t('description'),
  };

  const { data, content } = await loadMarkdown('score', locale);

  return {
    props: {
      _ns,
      seoProps,
      data,
      content,
    },
  };
};

export default withUserMe(ScorePage);

import { MarkdownTemplate } from 'components';
import { withUserMe } from 'hocs';
import { loadMarkdown, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { MarkdownPageProps } from 'types';

const ScorePage: NextPage<MarkdownPageProps> = ({ content }) => {
  const { t } = useTranslation();

  const layoutProps = {
    seoProps: {
      title: t('score:title'),
      description: t('score:description'),
    },
    topNavbarProps: {
      header: t('score:header'),
    },
    content,
  };

  return <MarkdownTemplate {...layoutProps} />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const _ns = await loadNamespaces(['score'], locale);
  const { content } = await loadMarkdown('score', locale);

  return {
    props: {
      _ns,
      content,
    },
  };
};

export default withUserMe(ScorePage);

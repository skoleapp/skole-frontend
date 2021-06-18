import { MarkdownTemplate } from 'components';
import { useMediaQueryContext } from 'context';
import { withUserMe } from 'hocs';
import { loadNamespaces, useTranslation } from 'lib';
import { loadMarkdown } from 'markdown';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { MarkdownPageProps } from 'types';

const ScorePage: NextPage<MarkdownPageProps> = ({ data: { title }, content: markdownContent }) => {
  const { t } = useTranslation();
  const { mdUp } = useMediaQueryContext();

  // The emoji won't stand out from the top navbar on mobile.
  const emoji = mdUp && '💯';

  const layoutProps = {
    seoProps: {
      title: t('score:title'),
      description: t('score:description'),
    },
    topNavbarProps: {
      header: title,
      emoji,
    },
    markdownContent,
  };

  return <MarkdownTemplate {...layoutProps} />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const _ns = await loadNamespaces(['score'], locale);
  const { data, content } = await loadMarkdown('score', locale);

  return {
    props: {
      _ns,
      data,
      content,
    },
  };
};

export default withUserMe(ScorePage);

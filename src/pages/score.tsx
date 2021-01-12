import { BackButton, MarkdownTemplate } from 'components';
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
      renderBackButton: <BackButton />,
      header: t('score:header'),
    },
  };

  return <MarkdownTemplate {...layoutProps}>{content}</MarkdownTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['score'], locale),
    content: await loadMarkdown('score'),
  },
});

export default withUserMe(ScorePage as NextPage);

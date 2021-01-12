import { BackButton, MarkdownTemplate } from 'components';
import { withUserMe } from 'hocs';
import { loadMarkdown, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { MarkdownPageProps } from 'types';

const GuidelinesPage: NextPage<MarkdownPageProps> = ({ content }) => {
  const { t } = useTranslation();

  const layoutProps = {
    seoProps: {
      title: t('guidelines:title'),
      description: t('guidelines:description'),
    },
    topNavbarProps: {
      renderBackButton: <BackButton />,
      header: t('guidelines:header'),
    },
  };

  return <MarkdownTemplate {...layoutProps}>{content}</MarkdownTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['guidelines'], locale),
    content: await loadMarkdown('guidelines'),
  },
});

export default withUserMe(GuidelinesPage as NextPage);

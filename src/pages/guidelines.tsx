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
    content,
  };

  return <MarkdownTemplate {...layoutProps} />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const _ns = await loadNamespaces(['guidelines'], locale);
  const { content } = await loadMarkdown('guidelines', locale);

  return {
    props: {
      _ns,
      content,
    },
  };
};

export default withUserMe(GuidelinesPage);

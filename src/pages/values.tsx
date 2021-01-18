import { BackButton, MarkdownTemplate } from 'components';
import { withUserMe } from 'hocs';
import { loadMarkdown, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { MarkdownPageProps } from 'types';

const ValuesPage: NextPage<MarkdownPageProps> = ({ content }) => {
  const { t } = useTranslation();

  const layoutProps = {
    seoProps: {
      title: t('values:title'),
      description: t('values:description'),
    },
    topNavbarProps: {
      renderBackButton: <BackButton />,
      header: t('values:header'),
    },
    content,
  };

  return <MarkdownTemplate {...layoutProps} />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const _ns = await loadNamespaces(['values'], locale);
  const { content } = await loadMarkdown('values', locale);

  return {
    props: {
      _ns,
      content,
    },
  };
};

export default withUserMe(ValuesPage);

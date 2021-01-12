import { BackButton, MarkdownTemplate } from 'components';
import { withUserMe } from 'hocs';
import { loadMarkdown, useTranslation } from 'lib';
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
  };

  return <MarkdownTemplate {...layoutProps}>{content}</MarkdownTemplate>;
};

export const getStaticProps: GetStaticProps = async () => ({
  props: {
    content: await loadMarkdown('values'),
  },
});

export default withUserMe(ValuesPage as NextPage);

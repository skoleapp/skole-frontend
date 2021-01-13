import { BackButton, MarkdownTemplate } from 'components';
import { withUserMe } from 'hocs';
import { loadMarkdownContent, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { MarkdownPageProps } from 'types';

const TermsPage: NextPage<MarkdownPageProps> = ({ content }) => {
  const { t } = useTranslation();

  const layoutProps = {
    seoProps: {
      title: t('terms:title'),
      description: t('terms:description'),
    },
    topNavbarProps: {
      renderBackButton: <BackButton />,
      header: 'Terms',
    },
  };

  return <MarkdownTemplate {...layoutProps}>{content}</MarkdownTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['terms'], locale),
    content: await loadMarkdownContent('terms'),
  },
});

export default withUserMe(TermsPage as NextPage);

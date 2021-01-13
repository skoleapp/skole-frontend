import { BackButton, MarkdownTemplate } from 'components';
import { withUserMe } from 'hocs';
import { loadMarkdown, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { MarkdownPageProps } from 'types';

const PrivacyPage: NextPage<MarkdownPageProps> = ({ data: { header }, content }) => {
  const { t } = useTranslation();

  const layoutProps = {
    seoProps: {
      title: t('privacy:title'),
      description: t('privacy:description'),
    },
    topNavbarProps: {
      renderBackButton: <BackButton />,
      header,
    },
  };

  return <MarkdownTemplate {...layoutProps}>{content}</MarkdownTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const _ns = await loadNamespaces(['privacy'], locale);
  const { data, content } = await loadMarkdown('privacy');

  return {
    props: {
      _ns,
      data,
      content,
    },
  };
};

export default withUserMe(PrivacyPage);

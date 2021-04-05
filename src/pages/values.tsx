import { MarkdownTemplate } from 'components';
import { useAuthContext } from 'context';
import { withUserMe } from 'hocs';
import { loadNamespaces, useTranslation } from 'lib';
import { loadMarkdown } from 'markdown';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { MarkdownPageProps } from 'types';

const ValuesPage: NextPage<MarkdownPageProps> = ({ data: { title }, content: markdownContent }) => {
  const { t } = useTranslation();
  const { userMe } = useAuthContext();

  const layoutProps = {
    seoProps: {
      title: t('values:title'),
    },
    topNavbarProps: {
      header: title,
      emoji: '💂',
    },
    markdownContent,
    hideBottomNavbar: !userMe,
  };

  return <MarkdownTemplate {...layoutProps} />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const _ns = await loadNamespaces(['values'], locale);
  const { data, content } = await loadMarkdown('values', locale);

  return {
    props: {
      _ns,
      data,
      content,
    },
  };
};

export default withUserMe(ValuesPage);

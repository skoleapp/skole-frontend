import Typography from '@material-ui/core/Typography';
import { Badge, ErrorTemplate, LoadingTemplate, MarkdownTemplate } from 'components';
import { BadgeObjectType, useBadgesQuery } from 'generated';
import { withUserMe } from 'hocs';
import { useLanguageHeaderContext } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { loadMarkdown } from 'markdown';
import { GetStaticProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { MarkdownPageProps } from 'types';

const BadgesPage: NextPage<MarkdownPageProps> = ({
  seoProps,
  data: { title },
  content: markdownContent,
}) => {
  const context = useLanguageHeaderContext();
  const { t } = useTranslation();
  const { data, loading, error } = useBadgesQuery({ context });
  const badges: BadgeObjectType[] = R.propOr([], 'badges', data);

  const renderBadgesHeader = (
    <Typography variant="body2" gutterBottom>
      {t('common:badges')}
    </Typography>
  );

  const renderBadges = (
    <>
      {badges.map((b) => (
        <Badge badge={b} />
      ))}
    </>
  );

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: title,
      emoji: '👀',
    },
    markdownContent,
    customBottomContent: [renderBadgesHeader, renderBadges],
  };

  if (loading) {
    return <LoadingTemplate seoProps={seoProps} />;
  }

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" seoProps={seoProps} />;
  }

  if (error) {
    return <ErrorTemplate variant="error" seoProps={seoProps} />;
  }

  return <MarkdownTemplate {...layoutProps} />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const _ns = await loadNamespaces(['badges'], locale);
  const t = await getT(locale, 'badges');

  const seoProps = {
    title: t('title'),
    description: t('description'),
  };

  const { data, content } = await loadMarkdown('badges', locale);

  return {
    props: {
      _ns,
      seoProps,
      data,
      content,
    },
  };
};

export default withUserMe(BadgesPage);

import Typography from '@material-ui/core/Typography';
import { Badge, ErrorTemplate, LoadingTemplate, MarkdownTemplate } from 'components';
import { useAuthContext } from 'context';
import { BadgeObjectType, useBadgesQuery } from 'generated';
import { withUserMe } from 'hocs';
import { useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { loadMarkdown } from 'markdown';
import { GetStaticProps, NextPage } from 'next';
import * as R from 'ramda';
import React, { useMemo } from 'react';
import { MarkdownPageProps } from 'types';

const BadgesPage: NextPage<MarkdownPageProps> = ({ data: { title }, content: markdownContent }) => {
  const context = useLanguageHeaderContext();
  const { t } = useTranslation();
  const { userMe } = useAuthContext();
  const { data, loading, error } = useBadgesQuery({ context });
  const badges: BadgeObjectType[] = R.propOr([], 'badges', data);

  const renderBadgesHeader = useMemo(
    () => (
      <Typography variant="body2" gutterBottom>
        {t('common:badges')}
      </Typography>
    ),
    [t],
  );

  const renderBadges = useMemo(
    () => (
      <>
        {badges.map((b) => (
          <Badge badge={b} />
        ))}
      </>
    ),
    [badges],
  );

  const layoutProps = {
    seoProps: {
      title: t('badges:title'),
    },
    topNavbarProps: {
      header: title,
      emoji: '👀',
    },
    markdownContent,
    customBottomContent: [renderBadgesHeader, renderBadges],
    hideBottomNavbar: !userMe,
  };

  if (loading) {
    return <LoadingTemplate />;
  }

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" />;
  }

  if (error) {
    return <ErrorTemplate variant="error" />;
  }

  return <MarkdownTemplate {...layoutProps} />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const _ns = await loadNamespaces(['badges'], locale);
  const { data, content } = await loadMarkdown('badges', locale);

  return {
    props: {
      _ns,
      data,
      content,
    },
  };
};

export default withUserMe(BadgesPage);

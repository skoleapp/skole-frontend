import {
  ActionRequiredTemplate,
  ErrorTemplate,
  ListTemplate,
  NotFoundBox,
  PaginatedTable,
  SkeletonThreadTableList,
  ThreadTableBody,
} from 'components';
import { useAuthContext } from 'context';
import { useStarredQuery } from 'generated';
import { withAuthRequired } from 'hocs';
import { useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useMemo } from 'react';

const StarredPage: NextPage = () => {
  const { t } = useTranslation();
  const { query } = useRouter();
  const variables = R.pick(['page', 'pageSize'], query);
  const context = useLanguageHeaderContext();
  const { verified } = useAuthContext();
  const { data, loading, error } = useStarredQuery({ variables, context });
  const threads = R.pathOr([], ['starredThreads', 'objects'], data);
  const page = R.pathOr(1, ['starredThreads', 'page'], data);
  const threadCount = R.pathOr(0, ['starredThreads', 'count'], data);

  const renderLoading = useMemo(() => loading && <SkeletonThreadTableList />, [loading]);
  const renderThreadTableBody = useMemo(() => <ThreadTableBody threads={threads} />, [threads]);
  const renderThreadsNotFound = useMemo(() => <NotFoundBox text={t('starred:noThreads')} />, [t]);

  const renderThreadTable = useMemo(
    () =>
      threads.length && (
        <PaginatedTable page={page} renderTableBody={renderThreadTableBody} count={threadCount} />
      ),
    [renderThreadTableBody, threadCount, threads.length, page],
  );

  const renderThreads = renderLoading || renderThreadTable || renderThreadsNotFound;

  const layoutProps = {
    seoProps: {
      title: t('starred:title'),
    },
    topNavbarProps: {
      header: t('starred:header'),
      emoji: '⭐',
    },
  };

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" />;
  }

  if (error) {
    return <ErrorTemplate variant="error" />;
  }

  if (!verified) {
    return <ActionRequiredTemplate variant="verify-account" {...layoutProps} {...layoutProps} />;
  }

  return <ListTemplate {...layoutProps}>{renderThreads}</ListTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['starred'], locale),
  },
});

export default withAuthRequired(StarredPage);

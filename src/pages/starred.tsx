import {
  ActionRequiredTemplate,
  CourseTableBody,
  ErrorTemplate,
  LoadingBox,
  NotFoundBox,
  PaginatedTable,
  ResourceTableBody,
  TabTemplate,
} from 'components';
import { useAuthContext } from 'context';
import { useStarredQuery } from 'generated';
import { withUserMe } from 'hocs';
import { useLanguageHeaderContext } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { SeoPageProps } from 'types';

const StarredPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const { t } = useTranslation();
  const { query } = useRouter();
  const variables = R.pick(['page', 'pageSize'], query);
  const context = useLanguageHeaderContext();
  const { data, loading, error } = useStarredQuery({ variables, context });
  const { userMe } = useAuthContext();
  const courses = R.pathOr([], ['starredCourses', 'objects'], data);
  const resources = R.pathOr([], ['starredResources', 'objects'], data);
  const courseCount = R.path(['starredCourses', 'count'], data);
  const resourceCount = R.path(['starredResources', 'count'], data);

  const renderLoading = <LoadingBox />;
  const renderResourceTableBody = <ResourceTableBody resources={resources} />;
  const renderCourseTableBody = <CourseTableBody courses={courses} />;
  const renderCoursesNotFound = <NotFoundBox text={t('starred:noCourses')} />;
  const renderResourcesNotFound = <NotFoundBox text={t('starred:noResources')} />;

  const renderCourseTable = (
    <PaginatedTable renderTableBody={renderCourseTableBody} count={courseCount} />
  );

  const renderResourceTable = (
    <PaginatedTable renderTableBody={renderResourceTableBody} count={resourceCount} />
  );

  const renderLeftTabContent =
    (loading && renderLoading) || (courses.length && renderCourseTable) || renderCoursesNotFound;

  const renderRightTabContent =
    (loading && renderLoading) ||
    (resources.length && renderResourceTable) ||
    renderResourcesNotFound;

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: t('starred:header'),
      emoji: '🤩',
    },
    tabTemplateProps: {
      leftTabLabel: `${t('common:courses')} (${courseCount})`,
      rightTabLabel: `${t('common:resources')} (${resourceCount})`,
      renderLeftTabContent,
      renderRightTabContent,
    },
  };

  if (!userMe) {
    return <ActionRequiredTemplate variant="login" {...layoutProps} />;
  }

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" seoProps={seoProps} />;
  }

  if (error) {
    return <ErrorTemplate variant="error" seoProps={seoProps} />;
  }

  return <TabTemplate {...layoutProps} />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const t = await getT(locale, 'starred');

  return {
    props: {
      _ns: await loadNamespaces(['starred'], locale),
      seoProps: {
        title: t('title'),
      },
    },
  };
};

export default withUserMe(StarredPage);

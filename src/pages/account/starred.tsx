import {
  CourseTableBody,
  ErrorTemplate,
  LoadingBox,
  LoginRequiredTemplate,
  NotFoundBox,
  OfflineTemplate,
  PaginatedTable,
  ResourceTableBody,
  TabTemplate,
} from 'components';
import { useAuthContext } from 'context';
import { useStarredQuery } from 'generated';
import { withUserMe } from 'hocs';
import { useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { urls } from 'utils';

const StarredPage: NextPage = () => {
  const { t } = useTranslation();
  const { query } = useRouter();
  const variables = R.pick(['page', 'pageSize'], query);
  const context = useLanguageHeaderContext();
  const { data, loading, error } = useStarredQuery({ variables, context });
  const { userMe, userMeId } = useAuthContext();
  const staticBackUrl = urls.user(userMeId);
  const courses = R.pathOr([], ['starredCourses', 'objects'], data);
  const resources = R.pathOr([], ['starredResources', 'objects'], data);
  const courseCount = R.pathOr(0, ['starredCourses', 'count'], data);
  const resourceCount = R.pathOr(0, ['starredResources', 'count'], data);
  const commonTableHeadProps = { titleRight: t('common:score') };
  const header = t('starred:header');

  const courseTableHeadProps = {
    titleLeft: t('common:name'),
    ...commonTableHeadProps,
  };

  const resourceTableHeadProps = {
    titleLeft: t('common:title'),
    ...commonTableHeadProps,
  };

  const renderLoading = <LoadingBox />;
  const renderResourceTableBody = <ResourceTableBody resources={resources} />;
  const renderCourseTableBody = <CourseTableBody courses={courses} />;

  const renderCourseTable = (
    <PaginatedTable
      tableHeadProps={courseTableHeadProps}
      renderTableBody={renderCourseTableBody}
      count={courseCount}
    />
  );

  const renderResourceTable = (
    <PaginatedTable
      tableHeadProps={resourceTableHeadProps}
      renderTableBody={renderResourceTableBody}
      count={resourceCount}
    />
  );

  const renderCoursesNotFound = <NotFoundBox text={t('starred:noCourses')} />;
  const renderResourcesNotFound = <NotFoundBox text={t('starred:noResources')} />;

  const renderLeftTabContent = loading
    ? renderLoading
    : courses.length
    ? renderCourseTable
    : renderCoursesNotFound;

  const renderRightTabContent = loading
    ? renderLoading
    : resources.length
    ? renderResourceTable
    : renderResourcesNotFound;

  const layoutProps = {
    seoProps: {
      title: t('starred:title'),
      description: t('starred:description'),
    },
    topNavbarProps: {
      staticBackUrl,
      header,
    },
    cardHeader: header,
    leftTabLabel: `${t('common:courses')} (${courseCount})`,
    rightTabLabel: `${t('common:resources')} (${resourceCount})`,
    renderLeftTabContent,
    renderRightTabContent,
  };

  if (!!error && !!error.networkError) {
    return <OfflineTemplate />;
  }

  if (error) {
    return <ErrorTemplate />;
  }

  if (!userMe) {
    return <LoginRequiredTemplate {...layoutProps} />;
  }

  return <TabTemplate {...layoutProps} />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['starred'], locale),
  },
});

export default withUserMe(StarredPage);

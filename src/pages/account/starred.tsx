import { Box, Tab, Tabs } from '@material-ui/core';
import {
  CourseTableBody,
  ErrorTemplate,
  LoadingBox,
  NotFoundBox,
  NotFoundTemplate,
  OfflineTemplate,
  PaginatedTable,
  ResourceTableBody,
  SettingsTemplate,
} from 'components';
import { useAuthContext } from 'context';
import { useStarredQuery } from 'generated';
import { withAuth } from 'hocs';
import { useLanguageHeaderContext, useSwipeableTabs } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import SwipeableViews from 'react-swipeable-views';

const StarredPage: NextPage = () => {
  const { t } = useTranslation();
  const { query } = useRouter();
  const { tabValue, handleTabChange, handleIndexChange } = useSwipeableTabs();
  const variables = R.pick(['page', 'pageSize'], query);
  const context = useLanguageHeaderContext();
  const { data, loading, error } = useStarredQuery({ variables, context });
  const { userMe } = useAuthContext();
  const courses = R.pathOr([], ['starredCourses', 'objects'], data);
  const resources = R.pathOr([], ['starredResources', 'objects'], data);
  const courseCount = R.pathOr(0, ['starredCourses', 'count'], data);
  const resourceCount = R.pathOr(0, ['starredResources', 'count'], data);
  const commonTableHeadProps = { titleRight: t('common:score') };

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

  const renderStarredCourses = loading
    ? renderLoading
    : courses.length
    ? renderCourseTable
    : renderCoursesNotFound;

  const renderStarredResources = loading
    ? renderLoading
    : resources.length
    ? renderResourceTable
    : renderResourcesNotFound;

  const renderTabs = (
    <Tabs value={tabValue} onChange={handleTabChange}>
      <Tab label={`${t('common:courses')} (${courseCount})`} />
      <Tab label={`${t('common:resources')} (${resourceCount})`} />
    </Tabs>
  );

  const renderSwipeableViews = (
    <Box flexGrow="1" position="relative" minHeight="30rem" overflow="hidden">
      <SwipeableViews index={tabValue} onChangeIndex={handleIndexChange}>
        {renderStarredCourses}
        {renderStarredResources}
      </SwipeableViews>
    </Box>
  );

  const layoutProps = {
    seoProps: {
      title: t('starred:title'),
      description: t('starred:description'),
    },
    header: t('starred:header'),
    disablePadding: true,
    topNavbarProps: {
      dynamicBackUrl: true,
    },
  };

  if (!!error && !!error.networkError) {
    return <OfflineTemplate />;
  }
  if (error) {
    return <ErrorTemplate />;
  }

  if (userMe) {
    return (
      <SettingsTemplate {...layoutProps}>
        {renderTabs}
        {renderSwipeableViews}
      </SettingsTemplate>
    );
  }
  return <NotFoundTemplate />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['starred'], locale),
  },
});

export default withAuth(StarredPage);

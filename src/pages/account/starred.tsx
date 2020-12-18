import { Tab, Tabs } from '@material-ui/core';
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
  TabPanel,
} from 'components';
import { useAuthContext } from 'context';
import { useStarredQuery } from 'generated';
import { withAuth } from 'hocs';
import { useLanguageHeaderContext, useTabs } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';

const StarredPage: NextPage = () => {
  const { t } = useTranslation();
  const { query } = useRouter();
  const { tabsProps, leftTabPanelProps, rightTabPanelProps } = useTabs();
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
    <>
      <Tabs {...tabsProps}>
        <Tab label={`${t('common:courses')} (${courseCount})`} />
        <Tab label={`${t('common:resources')} (${resourceCount})`} />
      </Tabs>
      <TabPanel {...leftTabPanelProps}>{renderStarredCourses}</TabPanel>
      <TabPanel {...rightTabPanelProps}>{renderStarredResources}</TabPanel>
    </>
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
    return <SettingsTemplate {...layoutProps}>{renderTabs}</SettingsTemplate>;
  }

  return <NotFoundTemplate />;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['starred'], locale),
  },
});

export default withAuth(StarredPage);

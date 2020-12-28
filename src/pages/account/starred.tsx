import { CardHeader, IconButton, makeStyles, Paper, Tab, Tabs, Tooltip } from '@material-ui/core';
import { ArrowBackOutlined } from '@material-ui/icons';
import {
  CourseTableBody,
  ErrorTemplate,
  LoadingBox,
  MainTemplate,
  NotFoundBox,
  NotFoundTemplate,
  OfflineTemplate,
  PaginatedTable,
  ResourceTableBody,
  TabPanel,
} from 'components';
import { useAuthContext } from 'context';
import { useStarredQuery } from 'generated';
import { withAuth } from 'hocs';
import { useLanguageHeaderContext, useMediaQueries, useTabs } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';
import { urls } from 'utils';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  cardHeader: {
    borderBottom: BORDER,
    paddingLeft: spacing(2),
  },
}));

const StarredPage: NextPage = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { query } = useRouter();
  const { isTabletOrDesktop } = useMediaQueries();
  const { tabsProps, leftTabPanelProps, rightTabPanelProps } = useTabs();
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

  const renderAvatar = (
    <Link href={staticBackUrl}>
      <Tooltip title={t('tooltips:backToProfile')}>
        <IconButton size="small">
          <ArrowBackOutlined />
        </IconButton>
      </Tooltip>
    </Link>
  );

  const renderHeader = isTabletOrDesktop && (
    <CardHeader className={classes.cardHeader} title={t('starred:header')} avatar={renderAvatar} />
  );

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
    topNavbarProps: {
      staticBackUrl,
      header: t('starred:header'),
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
      <MainTemplate {...layoutProps}>
        <Paper className={classes.root}>
          {renderHeader}
          {renderTabs}
        </Paper>
      </MainTemplate>
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

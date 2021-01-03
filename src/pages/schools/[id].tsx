import {
  CardHeader,
  List,
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { AddCircleOutlineOutlined } from '@material-ui/icons';
import {
  CourseTableBody,
  ErrorTemplate,
  IconButtonLink,
  InfoDialogContent,
  LoadingTemplate,
  MainTemplate,
  NotFoundBox,
  NotFoundTemplate,
  OfflineTemplate,
  PaginatedTable,
  ResponsiveDialog,
  ShareButton,
  TextLink,
  TabPanel,
  SubjectTableBody,
} from 'components';
import { useAuthContext } from 'context';
import { useSchoolQuery } from 'generated';
import { withUserMe } from 'hocs';
import {
  useActionsDialog,
  useInfoDialog,
  useLanguageHeaderContext,
  useMediaQueries,
  useSearch,
  useTabs,
} from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
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
    position: 'relative',
    borderBottom: BORDER,
    padding: spacing(3),
  },
  cardHeaderAction: {
    position: 'absolute',
    right: spacing(4),
  },
}));

const SchoolDetailPage: NextPage = () => {
  const classes = useStyles();
  const { verified, verificationRequiredTooltip } = useAuthContext();
  const { t } = useTranslation();
  const { isTabletOrDesktop, isMobile } = useMediaQueries();
  const { searchUrl } = useSearch();
  const { query } = useRouter();
  const variables = R.pick(['id', 'page', 'pageSize'], query);
  const context = useLanguageHeaderContext();
  const { data, loading, error } = useSchoolQuery({ variables, context });
  const school = R.propOr(null, 'school', data);
  const schoolId = R.propOr('', 'id', school);
  const schoolName = R.propOr('', 'name', school);
  const schoolTypeName = R.pathOr('', ['schoolType', 'name'], school);
  const schoolTypeId = R.pathOr('', ['schoolType', 'id'], school);
  const country = R.pathOr('', ['country', 'name'], school);
  const city = R.pathOr('', ['city', 'name'], school);
  const subjectCount = R.pathOr(0, ['subjects', 'count'], data);
  const courseCount = R.pathOr(0, ['courses', 'count'], data);
  const countryId = R.pathOr('', ['country', 'id'], school);
  const cityId = R.pathOr('', ['city', 'id'], school);
  const subjects = R.pathOr([], ['subjects', 'objects'], data);
  const courses = R.pathOr([], ['courses', 'objects'], data);
  const shareTitle = t('school:shareTitle', { schoolName });
  const shareText = t('school:shareText', { schoolName });
  const shareParams = { shareHeader: t('school:shareHeader'), shareTitle, shareText };
  const target = t('school:target');
  const addCourseTooltip = verificationRequiredTooltip || t('tooltips:addCourse');
  const { tabsProps, leftTabPanelProps, rightTabPanelProps } = useTabs();

  const {
    infoDialogOpen,
    infoDialogHeaderProps,
    renderInfoButton,
    handleCloseInfoDialog,
  } = useInfoDialog({
    header: t('school:infoHeader'),
    target,
  });

  const addCourseHref = {
    pathname: urls.addCourse,
    query: { school: schoolId },
  };

  const {
    actionsDialogOpen,
    actionsDialogHeaderProps,
    handleCloseActionsDialog,
    renderActionsButton,
    renderShareAction,
  } = useActionsDialog({
    share: t('school:share'),
    target,
    shareParams,
  });

  const schoolTypeLink = {
    ...searchUrl,
    query: { ...searchUrl.query, schoolType: schoolTypeId },
  };

  const countryLink = {
    ...searchUrl,
    query: { ...searchUrl.query, country: countryId },
  };

  const cityLink = {
    ...searchUrl,
    query: { ...searchUrl.query, city: cityId },
  };

  const renderSchoolTypeLink = (
    <TextLink href={schoolTypeLink} color="primary">
      {schoolTypeName}
    </TextLink>
  );

  const renderCountryLink = (
    <TextLink href={countryLink} color="primary">
      {country}
    </TextLink>
  );

  const renderCityLink = (
    <TextLink href={cityLink} color="primary">
      {city}
    </TextLink>
  );

  const infoItems = [
    {
      label: t('common:name'),
      value: schoolName,
    },
    {
      label: t('common:courses'),
      value: courseCount,
    },
    {
      label: t('common:subjects'),
      value: subjectCount,
    },
    {
      label: t('common:schoolType'),
      value: renderSchoolTypeLink,
    },
    {
      label: t('common:country'),
      value: renderCountryLink,
    },
    {
      label: t('common:city'),
      value: renderCityLink,
    },
  ];

  // On desktop, render a disabled button for non-verified users.
  // On mobile, do not render the button at all for non-verified users.
  const renderAddCourseButton = (isTabletOrDesktop || (isMobile && !!verified)) && (
    <Tooltip title={addCourseTooltip}>
      <Typography component="span">
        <IconButtonLink
          href={addCourseHref}
          icon={AddCircleOutlineOutlined}
          disabled={verified === false}
          color={isMobile ? 'secondary' : 'default'}
          size="small"
        />
      </Typography>
    </Tooltip>
  );

  const renderShareButton = <ShareButton {...shareParams} target={target} />;
  const renderSubjectsTableBody = <SubjectTableBody subjects={subjects} />;
  const renderCourseTableBody = <CourseTableBody courses={courses} />;

  const commonTableHeadProps = {
    titleLeft: t('common:name'),
  };

  const courseTableHeadProps = {
    ...commonTableHeadProps,
    titleRight: t('common:score'),
  };

  const renderSubjectsTable = (
    <PaginatedTable
      tableHeadProps={commonTableHeadProps}
      renderTableBody={renderSubjectsTableBody}
      count={subjectCount}
      extraFilters={variables}
    />
  );

  const renderCourseTable = (
    <PaginatedTable
      tableHeadProps={courseTableHeadProps}
      renderTableBody={renderCourseTableBody}
      count={courseCount}
      extraFilters={variables}
    />
  );

  const renderSubjectsNotFound = <NotFoundBox text={t('school:noSubjects')} />;
  const renderCoursesNotFound = <NotFoundBox text={t('school:noCourses')} />;
  const renderSubjects = subjects.length ? renderSubjectsTable : renderSubjectsNotFound;
  const renderCourses = courses.length ? renderCourseTable : renderCoursesNotFound;

  const renderAction = (
    <>
      {renderAddCourseButton}
      {renderShareButton}
      {renderInfoButton}
      {renderActionsButton}
    </>
  );

  const renderSchoolHeader = isTabletOrDesktop && (
    <CardHeader
      classes={{ root: classes.cardHeader, action: classes.cardHeaderAction }}
      title={schoolName}
      action={renderAction}
    />
  );

  const renderTabs = (
    <>
      <Tabs {...tabsProps}>
        <Tab label={`${t('common:subjects')} (${subjectCount})`} />
        <Tab label={`${t('common:courses')} (${courseCount})`} />
      </Tabs>
      <TabPanel {...leftTabPanelProps}>{renderSubjects}</TabPanel>
      <TabPanel {...rightTabPanelProps}>{renderCourses}</TabPanel>
    </>
  );

  const renderContent = (
    <Paper className={classes.root}>
      {renderSchoolHeader}
      {renderTabs}
    </Paper>
  );

  const renderInfoDialogContent = <InfoDialogContent infoItems={infoItems} />;

  const renderInfoDialog = (
    <ResponsiveDialog
      open={infoDialogOpen}
      onClose={handleCloseInfoDialog}
      dialogHeaderProps={infoDialogHeaderProps}
    >
      {renderInfoDialogContent}
    </ResponsiveDialog>
  );

  const renderAddCourseAction = (
    <Link href={addCourseHref}>
      <MenuItem>
        <ListItemIcon>
          <AddCircleOutlineOutlined />
        </ListItemIcon>
        <ListItemText>{t('school:addCourse')}</ListItemText>
      </MenuItem>
    </Link>
  );

  const renderActionsDialogContent = (
    <List>
      {renderShareAction}
      {renderAddCourseAction}
    </List>
  );

  const renderActionsDrawer = (
    <ResponsiveDialog
      open={actionsDialogOpen}
      onClose={handleCloseActionsDialog}
      dialogHeaderProps={actionsDialogHeaderProps}
    >
      {renderActionsDialogContent}
    </ResponsiveDialog>
  );

  const layoutProps = {
    seoProps: {
      title: schoolName,
      description: t('school:description', { schoolName }),
    },
    topNavbarProps: {
      dynamicBackUrl: true,
      headerLeft: renderAddCourseButton,
      headerRight: renderActionsButton,
      headerRightSecondary: renderInfoButton,
    },
  };

  if (loading) {
    return <LoadingTemplate />;
  }

  if (!!error && !!error.networkError) {
    return <OfflineTemplate />;
  }
  if (error) {
    return <ErrorTemplate />;
  }

  if (school) {
    return (
      <MainTemplate {...layoutProps}>
        {renderContent}
        {renderInfoDialog}
        {renderActionsDrawer}
      </MainTemplate>
    );
  }
  return <NotFoundTemplate />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['school'], locale),
  },
});

export default withUserMe(SchoolDetailPage);

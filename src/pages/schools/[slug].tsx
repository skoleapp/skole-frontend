import { SchoolObjectType, useSchoolQuery } from '__generated__/src/graphql/common.graphql';
import Grid from '@material-ui/core/Grid';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddCircleOutlineOutlined from '@material-ui/icons/AddCircleOutlineOutlined';
import clsx from 'clsx';
import {
  ActionsButton,
  ButtonLink,
  CourseTableBody,
  Discussion,
  DiscussionHeader,
  Emoji,
  ErrorTemplate,
  InfoButton,
  LoadingTemplate,
  MainTemplate,
  NotFoundBox,
  PaginatedTable,
  ShareButton,
  SubjectTableBody,
  TabPanel,
  TextLink,
} from 'components';
import { useAuthContext, useDiscussionContext } from 'context';
import { SchoolSeoPropsDocument } from 'generated';
import { withActions, withDiscussion, withInfo, withUserMe } from 'hocs';
import { useLanguageHeaderContext, useMediaQueries, useSearch, useTabs } from 'hooks';
import { getT, initApolloClient, loadNamespaces, useTranslation } from 'lib';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'styles';
import { SeoPageProps } from 'types';
import { getLanguageHeaderContext, MAX_REVALIDATION_INTERVAL, urls } from 'utils';

const useStyles = makeStyles(({ breakpoints, palette, spacing }) => ({
  mobileContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
  },
  desktopContainer: {
    flexGrow: 1,
  },
  paperContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  schoolHeaderRoot: {
    borderBottom: BORDER,
    height: '3.5rem',
  },
  headerTitle: {
    color: palette.text.secondary,
    flexGrow: 1,
    margin: `0 ${spacing(2)}`,
  },
  addCoursesButton: {
    minWidth: 'auto',
    whiteSpace: 'nowrap',
    padding: `${spacing(2)} ${spacing(4)}`,
  },
}));

const SchoolDetailPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const classes = useStyles();
  const { verified, verificationRequiredTooltip } = useAuthContext();
  const { t } = useTranslation();
  const { isTabletOrDesktop, isMobile } = useMediaQueries();
  const { searchUrl } = useSearch();
  const { query } = useRouter();
  const { tabsProps, firstTabPanelProps, secondTabPanelProps, thirdTabPanelProps } = useTabs();
  const context = useLanguageHeaderContext();
  const variables = R.pick(['slug', 'page', 'pageSize'], query);
  const { data, loading, error } = useSchoolQuery({ variables, context });
  const school: SchoolObjectType = R.propOr(null, 'school', data);
  const slug = R.propOr('', 'slug', school);
  const schoolName = R.propOr('', 'name', school);
  const schoolTypeName = R.pathOr('', ['schoolType', 'name'], school);
  const schoolTypeSlug = R.pathOr('', ['schoolType', 'slug'], school);
  const countrySlug = R.pathOr('', ['country', 'id'], school);
  const countryName = R.pathOr('', ['country', 'name'], school);
  const cityName = R.pathOr('', ['city', 'name'], school);
  const citySlug = R.pathOr('', ['city', 'slug'], school);
  const subjects = R.pathOr([], ['subjects', 'objects'], data);
  const courses = R.pathOr([], ['courses', 'objects'], data);
  const subjectCount = R.pathOr(0, ['subjects', 'count'], data);
  const courseCount = R.pathOr(0, ['courses', 'count'], data);
  const initialCommentCount = R.prop('commentCount', school);
  const { commentCount } = useDiscussionContext(initialCommentCount);
  const header = isTabletOrDesktop && schoolName; // School names are too long to be used as the header on mobile.
  const emoji = '🏫';

  const addCourseHref = {
    pathname: urls.addCourse,
    query: {
      school: slug,
    },
  };

  const schoolTypeLink = {
    ...searchUrl,
    query: { ...searchUrl.query, schoolType: schoolTypeSlug },
  };

  const countryLink = {
    ...searchUrl,
    query: { ...searchUrl.query, country: countrySlug },
  };

  const cityLink = {
    ...searchUrl,
    query: { ...searchUrl.query, city: citySlug },
  };

  const renderSchoolTypeLink = <TextLink href={schoolTypeLink}>{schoolTypeName}</TextLink>;
  const renderCountryLink = <TextLink href={countryLink}>{countryName}</TextLink>;
  const renderCityLink = <TextLink href={cityLink}>{cityName}</TextLink>;

  const infoItems = [
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
  const renderAddCourseButton = isTabletOrDesktop && (
    <Tooltip title={verificationRequiredTooltip || ''}>
      <Typography component="span">
        <ButtonLink
          className={classes.addCoursesButton}
          href={addCourseHref}
          disabled={verified === false}
          endIcon={<AddCircleOutlineOutlined />}
        >
          {t('common:addCourses')}
        </ButtonLink>
      </Typography>
    </Tooltip>
  );

  const shareDialogParams = {
    header: t('school:shareHeader'),
    title: t('school:shareTitle', { schoolName }),
    text: t('school:shareText', { schoolName }),
  };

  const renderShareButton = (
    <ShareButton tooltip={t('school-tooltips:share')} shareDialogParams={shareDialogParams} />
  );

  const infoDialogParams = {
    header: schoolName,
    emoji,
    infoItems,
  };

  const renderInfoButton = (
    <InfoButton tooltip={t('school-tooltips:info')} infoDialogParams={infoDialogParams} />
  );

  const renderAddCoursesAction = (
    <MenuItem>
      <ListItemIcon>
        <AddCircleOutlineOutlined />
      </ListItemIcon>
      <ListItemText>{t('common:addCourses')}</ListItemText>
    </MenuItem>
  );

  const actionsDialogParams = {
    shareDialogParams,
    shareText: t('school:share'),
    hideDeleteAction: true,
    renderCustomActions: [renderAddCoursesAction],
  };

  const renderActionsButton = (
    <ActionsButton
      tooltip={t('school-tooltips:actions')}
      actionsDialogParams={actionsDialogParams}
    />
  );

  const renderSubjectsTableBody = <SubjectTableBody subjects={subjects} />;
  const renderCourseTableBody = <CourseTableBody courses={courses} dense />;

  const renderSubjectsTable = (
    <PaginatedTable
      renderTableBody={renderSubjectsTableBody}
      count={subjectCount}
      extraFilters={variables}
    />
  );

  const renderCourseTable = (
    <PaginatedTable
      renderTableBody={renderCourseTableBody}
      count={courseCount}
      extraFilters={variables}
    />
  );

  const renderSubjectsNotFound = <NotFoundBox text={t('school:noSubjects')} />;
  const renderCoursesNotFound = <NotFoundBox text={t('school:noCourses')} />;
  const renderSubjects = subjects.length ? renderSubjectsTable : renderSubjectsNotFound;
  const renderCourses = courses.length ? renderCourseTable : renderCoursesNotFound;

  const renderDiscussionHeader = (
    <DiscussionHeader renderShareButton={renderShareButton} renderInfoButton={renderInfoButton} />
  );

  const renderDiscussion = <Discussion school={school} noCommentsText={t('school:noComments')} />;
  const renderEmoji = <Emoji emoji={emoji} />;

  const renderHeader = (
    <>
      {schoolName}
      {renderEmoji}
    </>
  );

  const renderHeaderTitle = (
    <Typography
      className={clsx('MuiCardHeader-title', classes.headerTitle, 'truncate-text')}
      variant="h5"
      align="left"
    >
      {renderHeader}
    </Typography>
  );

  const renderSchoolHeader = (
    <Grid container className={clsx('MuiCardHeader-root', classes.schoolHeaderRoot)} wrap="nowrap">
      {renderHeaderTitle}
      {renderAddCourseButton}
    </Grid>
  );

  const renderSchoolContent = (
    <>
      <Tabs {...tabsProps}>
        <Tab label={`${t('common:subjects')} (${subjectCount})`} />
        <Tab label={`${t('common:courses')} (${courseCount})`} />
      </Tabs>
      <TabPanel {...firstTabPanelProps}>{renderSubjects}</TabPanel>
      <TabPanel {...secondTabPanelProps}>{renderCourses}</TabPanel>
    </>
  );

  const renderMobileContent = isMobile && (
    <Paper className={classes.mobileContainer}>
      <Tabs {...tabsProps}>
        <Tab label={`${t('common:subjects')} (${subjectCount})`} wrapped />
        <Tab label={`${t('common:courses')} (${courseCount})`} wrapped />
        <Tab label={`${t('common:discussion')} (${commentCount})`} wrapped />
      </Tabs>
      <TabPanel {...firstTabPanelProps}>{renderSubjects}</TabPanel>
      <TabPanel {...secondTabPanelProps}>{renderCourses}</TabPanel>
      <TabPanel {...thirdTabPanelProps}>{renderDiscussion}</TabPanel>
    </Paper>
  );

  const renderDesktopContent = isTabletOrDesktop && (
    <Grid container spacing={2} className={classes.desktopContainer}>
      <Grid item container xs={12} md={6} lg={7} xl={8}>
        <Paper className={classes.paperContainer}>
          {renderSchoolHeader}
          {renderSchoolContent}
        </Paper>
      </Grid>
      <Grid item container xs={12} md={6} lg={5} xl={4}>
        <Paper className={classes.paperContainer}>
          {renderDiscussionHeader}
          {renderDiscussion}
        </Paper>
      </Grid>
    </Grid>
  );

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header,
      emoji,
      renderHeaderRight: renderActionsButton,
      renderHeaderRightSecondary: renderInfoButton,
    },
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

  return (
    <MainTemplate {...layoutProps}>
      {renderMobileContent}
      {renderDesktopContent}
    </MainTemplate>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

const namespaces = ['school', 'school-tooltips', 'discussion', 'discussion-tooltips'];

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const apolloClient = initApolloClient();
  const t = await getT(locale, 'school');
  const variables = R.pick(['slug'], params);
  const context = getLanguageHeaderContext(locale);

  const { data } = await apolloClient.query({
    query: SchoolSeoPropsDocument,
    variables,
    context,
  });

  const school = R.prop('school', data);

  if (!school) {
    return {
      notFound: true,
    };
  }

  const schoolName = R.propOr('', 'name', school);

  const seoProps = {
    title: schoolName,
    description: t('description', { schoolName }),
  };

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      _ns: await loadNamespaces(namespaces, locale),
      seoProps,
    },
    revalidate: MAX_REVALIDATION_INTERVAL,
  };
};

const withWrappers = R.compose(withUserMe, withActions, withInfo, withDiscussion);

export default withWrappers(SchoolDetailPage);

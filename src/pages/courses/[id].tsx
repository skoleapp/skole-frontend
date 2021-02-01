import { useCourseQuery } from '__generated__/src/graphql/common.graphql';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CloudUploadOutlined from '@material-ui/icons/CloudUploadOutlined';
import clsx from 'clsx';
import {
  ActionsButton,
  CustomBottomNavbarContainer,
  Discussion,
  DiscussionHeader,
  Emoji,
  ErrorTemplate,
  IconButtonLink,
  InfoButton,
  LoadingTemplate,
  MainTemplate,
  NotFoundBox,
  PaginatedTable,
  ResourceTableBody,
  ShareButton,
  TabPanel,
  TextLink,
} from 'components';
import {
  useAuthContext,
  useConfirmContext,
  useDiscussionContext,
  useNotificationsContext,
} from 'context';
import {
  CourseSeoPropsDocument,
  DeleteCourseMutation,
  SubjectObjectType,
  useDeleteCourseMutation,
} from 'generated';
import { withActions, withDiscussion, withInfo, withUserMe } from 'hocs';
import {
  useLanguageHeaderContext,
  useMediaQueries,
  useSearch,
  useStars,
  useTabs,
  useVotes,
} from 'hooks';
import { getT, initApolloClient, loadNamespaces, useTranslation } from 'lib';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';
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
  resourcesHeaderRoot: {
    borderBottom: BORDER,
  },
  backButton: {
    marginRight: spacing(2),
  },
  resourcesHeaderTitle: {
    color: palette.text.secondary,
    flexGrow: 1,
    marginLeft: spacing(2),
  },
  score: {
    marginLeft: spacing(2),
    marginRight: spacing(2),
  },
}));

const CourseDetailPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { isMobile, isTabletOrDesktop } = useMediaQueries();
  const { toggleNotification, toggleUnexpectedErrorNotification } = useNotificationsContext();
  const { confirm } = useConfirmContext();
  const { query } = useRouter();
  const { userMe, verified, verificationRequiredTooltip } = useAuthContext();
  const { searchUrl } = useSearch();
  const context = useLanguageHeaderContext();
  const variables = R.pick(['id', 'page', 'pageSize'], query);
  const { data, loading, error } = useCourseQuery({ variables, context });
  const course = R.prop('course', data);
  const courseName = R.propOr('', 'name', course);
  const courseCode = R.propOr('-', 'code', course);
  const subjects: SubjectObjectType[] = R.propOr([], 'subjects', course);
  const schoolName = R.pathOr('', ['school', 'name'], course);
  const creatorId = R.pathOr('', ['user', 'id'], course);
  const courseId = R.propOr('', 'id', course);
  const schoolId = R.pathOr('', ['school', 'id'], course);
  const initialScore = String(R.propOr(0, 'score', course));
  const initialStars = String(R.propOr(0, 'starCount', course));
  const resourceCount = R.pathOr(0, ['resources', 'count'], data);
  const initialCommentCount = R.prop('commentCount', course);
  const initialVote = R.propOr(null, 'vote', course);
  const starred = !!R.prop('starred', course);
  const isOwner = !!userMe && userMe.id === creatorId;
  const courseCreator = R.prop('user', course);
  const created = R.prop('created', course);
  const resources = R.pathOr([], ['resources', 'objects'], data);
  const creatorUsername = R.pathOr(t('common:communityUser'), ['user', 'username'], course);
  const { tabsProps, leftTabPanelProps, rightTabPanelProps } = useTabs();
  const { commentCount } = useDiscussionContext(initialCommentCount);
  const emoji = '🎓';

  const uploadResourceButtonTooltip =
    verificationRequiredTooltip || t('course-tooltips:uploadResource');

  const { stars, renderStarButton } = useStars({
    starred,
    initialStars,
    course: courseId,
    starTooltip: t('course-tooltips:star'),
    unstarTooltip: t('course-tooltips:unstar'),
  });

  const { renderUpvoteButton, renderDownvoteButton, score } = useVotes({
    initialVote,
    initialScore,
    isOwner,
    variables: { course: courseId },
    upvoteTooltip: t('course-tooltips:upvote'),
    removeUpvoteTooltip: t('course-tooltips:removeUpvote'),
    downvoteTooltip: t('course-tooltips:downvote'),
    removeDownvoteTooltip: t('course-tooltips:removeDownvote'),
    ownContentTooltip: t('course-tooltips:voteOwnContent'),
  });

  const deleteCourseCompleted = async ({ deleteCourse }: DeleteCourseMutation): Promise<void> => {
    if (deleteCourse) {
      if (!!deleteCourse.errors && !!deleteCourse.errors.length) {
        toggleUnexpectedErrorNotification();
      } else if (deleteCourse.successMessage) {
        toggleNotification(deleteCourse.successMessage);
        await Router.push(urls.home);
        sa_event('delete_course');
      } else {
        toggleUnexpectedErrorNotification();
      }
    } else {
      toggleUnexpectedErrorNotification();
    }
  };

  const [deleteCourse] = useDeleteCourseMutation({
    onCompleted: deleteCourseCompleted,
    onError: toggleUnexpectedErrorNotification,
    context,
  });

  const handleDeleteCourse = async (): Promise<void> => {
    try {
      await confirm({
        title: `${t('course:delete')}?`,
        description: t('course:confirmDelete'),
      });

      await deleteCourse({ variables: { id: courseId } });
    } catch {
      // User cancelled.
    }
  };

  const renderSubjectLinks = subjects.map(({ id, name }, i) => (
    <Grid key={i} item xs={12}>
      <TextLink
        href={{
          ...searchUrl,
          query: {
            ...searchUrl.query,
            subject: Number(id),
          },
        }}
        color="primary"
      >
        {name}
      </TextLink>
    </Grid>
  ));

  const renderSchoolLink = !!schoolId && (
    <TextLink href={urls.school(schoolId)} color="primary">
      {schoolName}
    </TextLink>
  );

  const infoItems = [
    {
      label: t('common:courseCode'),
      value: courseCode,
    },
    {
      label: t('common:subjects'),
      value: renderSubjectLinks,
    },
    {
      label: t('common:school'),
      value: renderSchoolLink,
    },
    {
      label: t('common:stars'),
      value: stars,
    },
    {
      label: t('common:score'),
      value: score,
    },
    {
      label: t('common:resources'),
      value: resourceCount,
    },
  ];

  const shareDialogParams = {
    header: t('course:shareHeader'),
    title: t('course:shareTitle', { courseName }),
    text: t('course:shareText', { courseName, creatorUsername }),
  };

  const renderShareButton = (
    <ShareButton tooltip={t('course-tooltips:share')} shareDialogParams={shareDialogParams} />
  );

  const infoDialogParams = {
    header: courseName,
    emoji,
    creator: courseCreator,
    created,
    infoItems,
  };

  const renderInfoButton = (
    <InfoButton tooltip={t('course-tooltips:info')} infoDialogParams={infoDialogParams} />
  );

  const actionsDialogParams = {
    shareDialogParams,
    deleteActionParams: {
      text: t('course:delete'),
      callback: handleDeleteCourse,
      disabled: verified === false,
    },
    shareText: t('course:share'),
    hideDeleteAction: !isOwner,
  };

  const renderActionsButton = (
    <ActionsButton
      tooltip={t('course-tooltips:actions')}
      actionsDialogParams={actionsDialogParams}
    />
  );

  const renderDiscussionHeader = (
    <DiscussionHeader
      renderShareButton={renderShareButton}
      renderInfoButton={renderInfoButton}
      renderActionsButton={renderActionsButton}
    />
  );

  const renderDiscussion = <Discussion course={course} noCommentsText={t('course:noComments')} />;

  const renderScore = (
    <Typography className={classes.score} variant="subtitle1" color="textSecondary">
      {score}
    </Typography>
  );

  const renderCustomBottomNavbarContent = (
    <Grid container>
      <Grid item xs={6} container justify="flex-start">
        {renderStarButton}
      </Grid>
      <Grid item xs={6} container justify="flex-end" alignItems="center">
        {renderUpvoteButton}
        {renderScore}
        {renderDownvoteButton}
      </Grid>
    </Grid>
  );

  // Only render the custom bottom navbar if the user is verified since all of the actions are only available for verified users.
  // The default bottom navbar will be automatically shown for non-verified users.
  const renderCustomBottomNavbar = !!verified && (
    <BottomNavigation>
      <CustomBottomNavbarContainer>{renderCustomBottomNavbarContent}</CustomBottomNavbarContainer>
    </BottomNavigation>
  );

  const notFoundLinkProps = {
    href: {
      pathname: urls.uploadResource,
      query: {
        school: schoolId,
        course: courseId,
      },
    },
    text: t('course:noResourcesLink'),
  };

  const renderResourceTableBody = <ResourceTableBody resources={resources} dense />;

  const renderResourceTable = (
    <PaginatedTable
      renderTableBody={renderResourceTableBody}
      count={resourceCount}
      extraFilters={variables}
    />
  );

  const renderResourcesNotFound = (
    <NotFoundBox text={t('course:noResources')} linkProps={notFoundLinkProps} />
  );

  const renderResources = resources.length ? renderResourceTable : renderResourcesNotFound;

  const uploadResourceHref = {
    pathname: urls.uploadResource,
    query: {
      school: schoolId,
      course: courseId,
    },
  };

  // Do not render a disabled button at all on mobile.
  const renderUploadResourceButton = (!!verified || isTabletOrDesktop) && (
    <Tooltip title={uploadResourceButtonTooltip}>
      <Typography component="span">
        <IconButtonLink
          href={uploadResourceHref}
          icon={CloudUploadOutlined}
          disabled={verified === false}
          color={isMobile ? 'secondary' : 'default'}
          size="small"
        />
      </Typography>
    </Tooltip>
  );

  const renderEmoji = <Emoji emoji={emoji} />;

  const renderHeader = (
    <>
      {courseName}
      {renderEmoji}
    </>
  );

  const renderResourcesTitle = (
    <Typography
      className={clsx('MuiCardHeader-title', classes.resourcesHeaderTitle, 'truncate-text')}
      variant="h5"
      align="left"
    >
      {renderHeader}
    </Typography>
  );

  const renderResourcesHeader = (
    <Grid
      container
      className={clsx('MuiCardHeader-root', classes.resourcesHeaderRoot)}
      wrap="nowrap"
    >
      {renderResourcesTitle}
      {renderStarButton}
      {renderUpvoteButton}
      {renderScore}
      {renderDownvoteButton}
      {renderUploadResourceButton}
    </Grid>
  );

  const renderMobileContent = isMobile && (
    <Paper className={classes.mobileContainer}>
      <Tabs {...tabsProps}>
        <Tab label={`${t('common:resources')} (${resourceCount})`} />
        <Tab label={`${t('common:discussion')} (${commentCount})`} />
      </Tabs>
      <TabPanel {...leftTabPanelProps}>{renderResources}</TabPanel>
      <TabPanel {...rightTabPanelProps}>{renderDiscussion}</TabPanel>
    </Paper>
  );

  const renderDesktopContent = isTabletOrDesktop && (
    <Grid container spacing={2} className={classes.desktopContainer}>
      <Grid item container xs={12} md={6} lg={7} xl={8}>
        <Paper className={clsx(classes.paperContainer)}>
          {renderResourcesHeader}
          {renderResources}
        </Paper>
      </Grid>
      <Grid item container xs={12} md={6} lg={5} xl={4}>
        <Paper className={clsx(classes.paperContainer)}>
          {renderDiscussionHeader}
          {renderDiscussion}
        </Paper>
      </Grid>
    </Grid>
  );

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      renderHeaderRight: renderActionsButton,
      renderHeaderRightSecondary: renderInfoButton,
      renderHeaderLeft: renderUploadResourceButton,
    },
    customBottomNavbar: renderCustomBottomNavbar,
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

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
});

const namespaces = ['course', 'course-tooltips', 'discussion', 'discussion-tooltips'];

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const apolloClient = initApolloClient();
  const t = await getT(locale, 'course');
  const variables = R.pick(['id'], params);
  const context = getLanguageHeaderContext(locale);

  const { data } = await apolloClient.query({
    query: CourseSeoPropsDocument,
    variables,
    context,
  });

  const course = R.prop('course', data);

  if (!course) {
    return {
      notFound: true,
    };
  }

  const courseName = R.propOr('', 'name', course);
  const courseCode = R.propOr('', 'code', course);

  const seoProps = {
    title: `${courseName} - ${courseCode}`,
    description: t('description', { courseName, courseCode }),
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

export default withWrappers(CourseDetailPage);

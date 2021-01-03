import {
  BottomNavigation,
  CardHeader,
  Grid,
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
import { CloudUploadOutlined, DeleteOutline } from '@material-ui/icons';
import clsx from 'clsx';
import {
  CustomBottomNavbarContainer,
  DiscussionHeader,
  ErrorTemplate,
  IconButtonLink,
  InfoDialogContent,
  LoadingTemplate,
  MainTemplate,
  NotFoundBox,
  NotFoundTemplate,
  OfflineTemplate,
  PaginatedTable,
  ResourceTableBody,
  ResponsiveDialog,
  ShareButton,
  TabPanel,
  TextLink,
  TopLevelCommentThread,
} from 'components';
import {
  useAuthContext,
  useDiscussionContext,
  useNotificationsContext,
  useConfirmContext,
} from 'context';
import {
  DeleteCourseMutation,
  useCourseQuery,
  useDeleteCourseMutation,
  SubjectObjectType,
} from 'generated';
import { withDiscussion, withUserMe } from 'hocs';
import {
  useActionsDialog,
  useInfoDialog,
  useLanguageHeaderContext,
  useMediaQueries,
  useSearch,
  useStars,
  useTabs,
  useVotes,
} from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';

import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { SyntheticEvent } from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';
import { urls } from 'utils';

const useStyles = makeStyles(({ breakpoints }) => ({
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
  resourcesHeader: {
    borderBottom: BORDER,
  },
}));

const CourseDetailPage: NextPage = () => {
  const classes = useStyles();
  const { query } = useRouter();
  const { t } = useTranslation();
  const { isMobile, isTabletOrDesktop } = useMediaQueries();
  const { toggleNotification, unexpectedError } = useNotificationsContext();
  const { confirm } = useConfirmContext();
  const variables = R.pick(['id', 'page', 'pageSize'], query);
  const context = useLanguageHeaderContext();
  const { data, loading, error } = useCourseQuery({ variables, context });
  const { userMe, verified, verificationRequiredTooltip } = useAuthContext();
  const { searchUrl } = useSearch();
  const course = R.propOr(null, 'course', data);
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
  const comments = R.propOr([], 'comments', course);
  const { commentCount } = useDiscussionContext(comments);
  const initialVote = R.propOr(null, 'vote', course);
  const starred = !!R.prop('starred', course);
  const isOwner = !!userMe && userMe.id === creatorId;
  const courseCreator = R.prop('user', course);
  const creatorUsername = R.pathOr(t('common:communityUser'), ['user', 'username'], course);
  const shareTitle = t('course:shareTitle', { courseName });
  const shareText = t('course:shareText', { courseName, creatorUsername });
  const shareParams = { shareHeader: t('course:shareHeader'), shareTitle, shareText };
  const created = R.prop('created', course);
  const resources = R.pathOr([], ['resources', 'objects'], data);
  const { tabsProps, leftTabPanelProps, rightTabPanelProps } = useTabs(comments);

  const uploadResourceButtonTooltip =
    verificationRequiredTooltip || t('course-tooltips:uploadResource');

  const { stars, renderStarButton } = useStars({
    starred,
    initialStars,
    course: courseId,
    starTooltip: t('course-tooltips:star'),
    unstarTooltip: t('course-tooltips:unstar'),
  });

  const {
    infoDialogOpen,
    infoDialogHeaderProps,
    renderInfoButton,
    handleCloseInfoDialog,
  } = useInfoDialog({
    header: t('course:infoHeader'),
    infoButtonTooltip: t('course-tooltips:info'),
  });

  const {
    actionsDialogOpen,
    actionsDialogHeaderProps,
    handleCloseActionsDialog,
    renderShareAction,
    renderReportAction,
    renderActionsButton,
  } = useActionsDialog({
    shareParams,
    share: t('course:share'),
    actionsButtonTooltip: t('course-tooltips:actions'),
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
        unexpectedError();
      } else if (deleteCourse.successMessage) {
        toggleNotification(deleteCourse.successMessage);
        await Router.push(urls.home);
      } else {
        unexpectedError();
      }
    } else {
      unexpectedError();
    }
  };

  const [deleteCourse] = useDeleteCourseMutation({
    onCompleted: deleteCourseCompleted,
    onError: unexpectedError,
    context,
  });

  const handleDeleteCourse = async (e: SyntheticEvent): Promise<void> => {
    handleCloseActionsDialog(e);

    try {
      await confirm({
        title: t('course:delete'),
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
          query: { ...searchUrl.query, subject: Number(id) },
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
      label: t('common:name'),
      value: courseName,
    },
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

  const renderShareButton = <ShareButton {...shareParams} tooltip={t('course-tooltips:share')} />;

  const discussionHeaderProps = {
    commentCount,
    renderStarButton,
    renderUpvoteButton,
    renderDownvoteButton,
    renderShareButton,
    renderInfoButton,
    renderActionsButton,
  };

  const commentThreadProps = {
    target: { course: Number(courseId) },
    noComments: t('course:noComments'),
  };

  const renderDiscussionHeader = <DiscussionHeader {...discussionHeaderProps} />;
  const renderDiscussion = <TopLevelCommentThread {...commentThreadProps} />;

  // Only render the custom bottom navbar if the user is verified since all of the actions are only available for verified users.
  // The default bottom navbar will be automatically shown for non-verified users.
  const renderCustomBottomNavbar = !!verified && (
    <BottomNavigation>
      <CustomBottomNavbarContainer>
        <Grid container>
          <Grid item xs={6} container justify="flex-start">
            {renderStarButton}
          </Grid>
          <Grid item xs={6} container justify="flex-end">
            {renderUpvoteButton}
            {renderDownvoteButton}
          </Grid>
        </Grid>
      </CustomBottomNavbarContainer>
    </BottomNavigation>
  );

  const resourceTableHeadProps = {
    titleLeft: t('common:title'),
    titleLeftDesktop: t('common:resources'),
    titleRight: t('common:score'),
  };

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

  const renderResourceTableBody = <ResourceTableBody resources={resources} />;

  const renderResourceTable = (
    <PaginatedTable
      tableHeadProps={resourceTableHeadProps}
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
    query: { school: schoolId, course: courseId },
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

  const renderResourcesHeader = (
    <CardHeader
      className={classes.resourcesHeader}
      title={courseName}
      action={renderUploadResourceButton}
    />
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

  const renderInfoDialogContent = (
    <InfoDialogContent creator={courseCreator} created={created} infoItems={infoItems} />
  );

  const renderInfoDialog = (
    <ResponsiveDialog
      open={infoDialogOpen}
      onClose={handleCloseInfoDialog}
      dialogHeaderProps={infoDialogHeaderProps}
    >
      {renderInfoDialogContent}
    </ResponsiveDialog>
  );

  const renderDeleteAction = isOwner && (
    <MenuItem onClick={handleDeleteCourse} disabled={verified === false}>
      <ListItemIcon>
        <DeleteOutline />
      </ListItemIcon>
      <ListItemText>{t('course:delete')}</ListItemText>
    </MenuItem>
  );

  const renderActionsDialogContent = (
    <List>
      {renderShareAction}
      {renderDeleteAction}
      {renderReportAction}
    </List>
  );

  const renderActionsDialog = (
    <ResponsiveDialog
      open={actionsDialogOpen}
      onClose={handleCloseActionsDialog}
      dialogHeaderProps={actionsDialogHeaderProps}
      list
    >
      {renderActionsDialogContent}
    </ResponsiveDialog>
  );

  const layoutProps = {
    seoProps: {
      title: courseName,
      description: t('course:description', { courseName }),
    },
    topNavbarProps: {
      staticBackUrl: searchUrl,
      headerRight: renderActionsButton,
      headerRightSecondary: renderInfoButton,
      headerLeft: renderUploadResourceButton,
    },
    customBottomNavbar: renderCustomBottomNavbar,
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

  if (course) {
    return (
      <MainTemplate {...layoutProps}>
        {renderMobileContent}
        {renderDesktopContent}
        {renderInfoDialog}
        {renderActionsDialog}
      </MainTemplate>
    );
  }
  return <NotFoundTemplate />;
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
});

const namespaces = ['course', 'course-tooltips', 'discussion', 'discussion-tooltips'];

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(namespaces, locale),
  },
});

const withWrappers = R.compose(withUserMe, withDiscussion);

export default withWrappers(CourseDetailPage);

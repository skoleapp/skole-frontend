import {
  BottomNavigation,
  Box,
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
  StarButton,
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
  useSwipeableTabs,
  useVotes,
} from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';

import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { SyntheticEvent } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { BORDER_RADIUS } from 'theme';
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
  discussionHeader: {
    textAlign: 'left',
  },
}));

const CourseDetailPage: NextPage = () => {
  const classes = useStyles();
  const { query } = useRouter();
  const { t } = useTranslation();
  const { isMobile, isTabletOrDesktop } = useMediaQueries();
  const { toggleNotification } = useNotificationsContext();
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
  const resourceCount = R.pathOr(0, ['resources', 'count'], data);
  const comments = R.propOr([], 'comments', course);
  const { commentCount } = useDiscussionContext();
  const initialVote = R.propOr(null, 'vote', course);
  const starred = !!R.prop('starred', course);
  const isOwner = !!userMe && userMe.id === creatorId;
  const courseCreator = R.prop('user', course);
  const creatorUsername = R.pathOr(t('common:communityUser'), ['user', 'username'], course);
  const shareTitle = t('course:shareTitle', { courseName });
  const shareText = t('course:shareText', { courseName, creatorUsername });
  const shareParams = { shareTitle, shareText };
  const created = R.prop('created', course);
  const resources = R.pathOr([], ['resources', 'objects'], data);
  const uploadResourceButtonTooltip = verificationRequiredTooltip || t('tooltips:uploadResource');
  const { tabValue, handleTabChange, handleIndexChange } = useSwipeableTabs(comments);

  const {
    infoDialogOpen,
    infoDialogHeaderProps,
    renderInfoButton,
    handleCloseInfoDialog,
  } = useInfoDialog();

  const {
    actionsDialogOpen,
    actionsDialogHeaderProps,
    handleCloseActionsDialog,
    renderShareAction,
    renderReportAction,
    renderActionsButton,
  } = useActionsDialog(shareParams);

  const { renderUpVoteButton, renderDownVoteButton, score } = useVotes({
    initialVote,
    initialScore,
    isOwner,
    variables: { course: courseId },
  });

  const deleteCourseError = (): void => toggleNotification(t('notifications:deleteCourseError'));

  const deleteCourseCompleted = async ({ deleteCourse }: DeleteCourseMutation): Promise<void> => {
    if (deleteCourse) {
      if (!!deleteCourse.errors && !!deleteCourse.errors.length) {
        deleteCourseError();
      } else if (deleteCourse.successMessage) {
        toggleNotification(deleteCourse.successMessage);
        await Router.push(urls.home);
      } else {
        deleteCourseError();
      }
    } else {
      deleteCourseError();
    }
  };

  const [deleteCourse] = useDeleteCourseMutation({
    onCompleted: deleteCourseCompleted,
    onError: deleteCourseError,
    context,
  });

  const handleDeleteCourse = async (e: SyntheticEvent): Promise<void> => {
    try {
      await confirm({
        title: t('course:deleteCourseTitle'),
        description: t('course:deleteCourseDescription'),
      });

      await deleteCourse({ variables: { id: courseId } });
    } catch {
      // User cancelled.
    } finally {
      handleCloseActionsDialog(e);
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
      label: t('common:score'),
      value: score,
    },
    {
      label: t('common:resources'),
      value: resourceCount,
    },
  ];

  // On desktop, render a disabled button for non-verified users.
  // On mobile, do not render the button at all for non-verified users.
  const renderStarButton = (!!verified || isTabletOrDesktop) && (
    <StarButton starred={starred} course={courseId} />
  );

  const renderShareButton = <ShareButton {...shareParams} />;

  const discussionHeaderProps = {
    commentCount,
    renderStarButton,
    renderUpVoteButton,
    renderDownVoteButton,
    renderShareButton,
    renderInfoButton,
    renderActionsButton,
  };

  const commentThreadProps = {
    comments,
    target: { course: Number(courseId) },
    noComments: t('course:noComments'),
  };

  const renderDiscussionHeader = <DiscussionHeader {...discussionHeaderProps} />;
  const renderDiscussion = <TopLevelCommentThread {...commentThreadProps} />;

  const renderCustomBottomNavbar = (
    <BottomNavigation>
      <CustomBottomNavbarContainer>
        <Grid container>
          <Grid item xs={6} container justify="flex-start">
            {renderStarButton}
          </Grid>
          <Grid item xs={6} container justify="flex-end">
            {renderUpVoteButton}
            {renderDownVoteButton}
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
    <CardHeader title={courseName} action={renderUploadResourceButton} />
  );

  const renderMobileContent = isMobile && (
    <Paper className={classes.mobileContainer}>
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label={`${t('common:resources')} (${resourceCount})`} />
        <Tab label={`${t('common:discussion')} (${commentCount})`} />
      </Tabs>
      <Box flexGrow="1" position="relative" overflow="hidden">
        <SwipeableViews index={tabValue} onChangeIndex={handleIndexChange}>
          {renderResources}
          {renderDiscussion}
        </SwipeableViews>
      </Box>
    </Paper>
  );

  const renderDesktopContent = isTabletOrDesktop && (
    <Grid container spacing={2} className={classes.desktopContainer}>
      <Grid item container xs={12} md={6} lg={8}>
        <Paper className={clsx(classes.paperContainer)}>
          {renderResourcesHeader}
          {renderResources}
        </Paper>
      </Grid>
      <Grid item container xs={12} md={6} lg={4}>
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
      <ListItemText>{t('common:delete')}</ListItemText>
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
      staticBackUrl: { href: searchUrl },
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

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['course'], locale),
  },
});

const withWrappers = R.compose(withUserMe, withDiscussion);

export default withWrappers(CourseDetailPage);

import BottomNavigation from '@material-ui/core/BottomNavigation';
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
import CloudUploadOutlined from '@material-ui/icons/CloudUploadOutlined';
import ThumbsUpDownOutlined from '@material-ui/icons/ThumbsUpDownOutlined';
import clsx from 'clsx';
import {
  ActionsButton,
  ButtonLink,
  CustomBottomNavbarContainer,
  Discussion,
  DiscussionHeader,
  Emoji,
  ErrorTemplate,
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
  useCourseQuery,
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
  courseHeaderRoot: {
    borderBottom: BORDER,
  },
  backButton: {
    marginRight: spacing(2),
  },
  headerTitle: {
    color: palette.text.secondary,
    flexGrow: 1,
    marginLeft: spacing(2),
  },
  score: {
    marginLeft: spacing(2),
    marginRight: spacing(2),
  },
  uploadResourceButton: {
    minWidth: 'auto',
    whiteSpace: 'nowrap',
    marginLeft: spacing(2),
    padding: `${spacing(2)} ${spacing(4)}`,
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
  const variables = R.pick(['slug', 'page', 'pageSize'], query);
  const { data, loading, error } = useCourseQuery({ variables, context });
  const course = R.prop('course', data);
  const name = R.prop('name', course);
  const codes = R.prop('codes', course);
  const courseName = codes ? `${name} - ${codes}` : name;
  const subjects: Pick<SubjectObjectType, 'slug'>[] = R.propOr([], 'subjects', course);
  const courseId = R.prop('id', course);
  const slug = R.prop('slug', course);
  const schoolSlug = R.path(['school', 'slug'], course);
  const initialScore = R.prop('score', course);
  const initialStars = R.prop('starCount', course);
  const resources = R.pathOr([], ['resources', 'objects'], data);
  const resourceCount = R.path(['resources', 'count'], data);
  const initialCommentCount = R.prop('commentCount', course);
  const initialVote = R.prop('vote', course);
  const starred = R.prop('starred', course);
  const creator = R.prop('user', course);
  const isOwner = !!creator && userMe?.id === creator.id;
  const created = R.prop('created', course);
  const creatorUsername = R.propOr(t('common:communityUser'), 'username', course);
  const { tabsProps, firstTabPanelProps, secondTabPanelProps } = useTabs();
  const { commentCount } = useDiscussionContext(initialCommentCount);
  const emoji = '🎓';

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
    if (deleteCourse?.errors?.length) {
      toggleUnexpectedErrorNotification();
    } else if (deleteCourse?.successMessage) {
      toggleNotification(deleteCourse.successMessage);
      await Router.push(urls.home);
      sa_event('delete_course');
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

  const renderSubjectLinks = subjects.map(({ slug }, i) => (
    <Grid key={i} item xs={12}>
      <TextLink
        href={{
          ...searchUrl,
          query: {
            ...searchUrl.query,
            subject: slug,
          },
        }}
      >
        #{slug}
      </TextLink>
    </Grid>
  ));

  const renderSchoolLink = !!schoolSlug && (
    <TextLink href={urls.school(schoolSlug)}>#{schoolSlug}</TextLink>
  );

  const infoItems = [
    {
      label: t('common:course'),
      value: name,
    },
    {
      label: t('common:codes'),
      value: codes,
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
    creator,
    created,
    infoItems,
  };

  const renderInfoButton = (
    <InfoButton tooltip={t('course-tooltips:info')} infoDialogParams={infoDialogParams} />
  );

  const renderUploadResourceAction = (
    <MenuItem>
      <ListItemIcon>
        <CloudUploadOutlined />
      </ListItemIcon>
      <ListItemText>{t('common:uploadResources')}</ListItemText>
    </MenuItem>
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
    renderCustomActions: [renderUploadResourceAction],
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

  // Only render for non-verified users and owners to make the score more clear.
  const renderScoreIcon = (!verified || isOwner) && <ThumbsUpDownOutlined color="disabled" />;

  const renderCustomBottomNavbarContent = (
    <Grid container>
      <Grid item xs={6} container justify="flex-start">
        {renderStarButton}
      </Grid>
      <Grid item xs={6} container justify="flex-end" alignItems="center">
        {renderUpvoteButton}
        {renderScoreIcon}
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

  const uploadResourceHref = {
    pathname: urls.uploadMaterial,
    query: {
      school: schoolSlug,
      course: slug,
    },
  };

  const notFoundLinkProps = {
    href: uploadResourceHref,
    text: t('course:noResourcesLink'),
  };

  const renderResourceTableBody = <ResourceTableBody resources={resources} hideCourseLink dense />;

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

  // On desktop, render a disabled button for non-verified users.
  const renderUploadResourceButton = isTabletOrDesktop && (
    <Tooltip title={verificationRequiredTooltip || ''}>
      <Typography component="span">
        <ButtonLink
          className={classes.uploadResourceButton}
          href={uploadResourceHref}
          disabled={verified === false}
          endIcon={<CloudUploadOutlined />}
        >
          {t('common:uploadResources')}
        </ButtonLink>
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

  const renderHeaderTitle = (
    <Typography
      className={clsx('MuiCardHeader-title', classes.headerTitle, 'truncate-text')}
      variant="h5"
      align="left"
    >
      {renderHeader}
    </Typography>
  );

  const renderCourseHeader = (
    <Grid container className={clsx('MuiCardHeader-root', classes.courseHeaderRoot)} wrap="nowrap">
      {renderHeaderTitle}
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
      <TabPanel {...firstTabPanelProps}>{renderResources}</TabPanel>
      <TabPanel {...secondTabPanelProps}>{renderDiscussion}</TabPanel>
    </Paper>
  );

  const renderDesktopContent = isTabletOrDesktop && (
    <Grid container spacing={2} className={classes.desktopContainer}>
      <Grid item container xs={12} md={6} lg={7} xl={8}>
        <Paper className={classes.paperContainer}>
          {renderCourseHeader}
          {renderResources}
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
      renderHeaderRight: renderActionsButton,
      renderHeaderRightSecondary: renderInfoButton,
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
  const variables = R.pick(['slug'], params);
  const context = getLanguageHeaderContext(locale);
  let seoProps = {};

  try {
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

    const courseName = course.codes ? `${course.name} - ${course.codes}` : course.name;

    seoProps = {
      title: courseName,
      description: t('description', { courseName }),
    };
  } catch {
    // Network error.
  }

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

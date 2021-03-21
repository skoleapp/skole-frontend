import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import SettingsOutlined from '@material-ui/icons/SettingsOutlined';
import StarBorderOutlined from '@material-ui/icons/StarBorderOutlined';
import clsx from 'clsx';
import {
  Badge,
  ButtonLink,
  CommentTableBody,
  CourseTableBody,
  DialogHeader,
  Emoji,
  ErrorTemplate,
  Link,
  LoadingTemplate,
  MainTemplate,
  NotFoundBox,
  PaginatedTable,
  ResourceTableBody,
  SettingsButton,
  SkoleDialog,
  TabPanel,
  TextLink,
} from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import {
  BadgeObjectType,
  BadgeProgressFieldsFragment,
  UpdateSelectedBadgeMutation,
  UserSeoPropsDocument,
  useUpdateSelectedBadgeMutation,
  useUserQuery,
} from 'generated';
import { withUserMe } from 'hocs';
import { useDayjs, useLanguageHeaderContext, useMediaQueries, useOpen } from 'hooks';
import { getT, initApolloClient, loadNamespaces, useTranslation } from 'lib';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { BORDER_RADIUS } from 'styles';
import { SeoPageProps } from 'types';
import { getLanguageHeaderContext, MAX_REVALIDATION_INTERVAL, mediaUrl, urls } from 'utils';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  paper: {
    padding: spacing(4),
    paddingRight: `calc(${spacing(4)} + env(safe-area-inset-right))`,
    paddingLeft: `calc(${spacing(4)} + env(safe-area-inset-left))`,
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  createdContent: {
    flexGrow: 1,
    marginTop: spacing(2),
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    paddingRight: 'env(safe-area-inset-right)',
    paddingLeft: 'env(safe-area-inset-left)',
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  mobileActionsCard: {
    marginTop: spacing(2),
  },
  avatar: {
    width: '5rem',
    height: '5rem',
    marginBottom: spacing(4),
    [breakpoints.up('md')]: {
      width: '7rem',
      height: '7rem',
    },
  },
  statsContainer: {
    marginTop: spacing(4),
    marginBottom: spacing(2),
    textAlign: 'center',
  },
  statValue: {
    marginRight: spacing(1),
  },
  stepper: {
    padding: `${spacing(6)} 0`,
  },
  step: {
    paddingLeft: 0,
    paddingRight: spacing(4),
  },
  bio: {
    wordBreak: 'break-word',
    marginTop: spacing(4),
  },
  rankContainer: {
    marginTop: spacing(4),
  },
  badgeContainer: {
    marginTop: spacing(4),
  },
  changeSelectedBadgeButton: {
    padding: spacing(1),
    marginLeft: spacing(2),
  },
  changeSelectedBadgeIcon: {
    width: '1.25rem',
    height: '1.25rem',
  },
  verifyAccount: {
    marginTop: spacing(4),
  },
  profileStrengthContainer: {
    [breakpoints.up('md')]: {
      marginTop: spacing(4),
    },
  },
  joined: {
    marginTop: spacing(2),
  },
  button: {
    [breakpoints.down('md')]: {
      marginTop: spacing(2),
    },
    [breakpoints.up('md')]: {
      marginLeft: spacing(2),
    },
  },
  badgeCardActionArea: {
    borderRadius: '0.5rem',
    padding: spacing(2),
  },
  badgeDescription: {
    marginLeft: spacing(3),
  },
}));

interface ProfileStrengthStep {
  label: string;
  href: string;
  completed: boolean;
}

const UserPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const classes = useStyles();
  const { isMobile, isTabletOrDesktop } = useMediaQueries();
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const { toggleUnexpectedErrorNotification } = useNotificationsContext();

  const {
    userMe,
    school,
    subject,
    badgeProgresses,
    selectedBadgeProgress: initialSelectedBadgeProgress,
    verified,
  } = useAuthContext();

  const [
    selectedBadgeProgress,
    setSelectedBadgeProgress,
  ] = useState<BadgeProgressFieldsFragment | null>(initialSelectedBadgeProgress);
  const { query } = useRouter();
  const context = useLanguageHeaderContext();
  const variables = R.pick(['slug', 'page', 'pageSize'], query);
  const { data, loading, error } = useUserQuery({ variables, context });

  const {
    open: selectBadgeDialogOpen,
    handleOpen: handleOpenSelectBadgeDialog,
    handleClose: handleCloseSelectBadgeDialog,
  } = useOpen();

  const user = R.prop('user', data);
  const rank = R.prop('rank', user);
  const username = R.prop('username', user);
  const avatar = R.prop('avatar', user);
  const title = R.prop('title', user);
  const bio = R.prop('bio', user);
  const score = R.prop('score', user);
  const isOwnProfile = !!user?.id && userMe?.id === user.id;
  const badges: BadgeObjectType[] = R.propOr([], 'badges', user);
  const courseCount = R.path(['courses', 'count'], data);
  const resourceCount = R.path(['resources', 'count'], data);
  const commentCount = R.path(['comments', 'count'], data);
  const courses = R.pathOr([], ['courses', 'objects'], data);
  const resources = R.pathOr([], ['resources', 'objects'], data);
  const comments = R.pathOr([], ['comments', 'objects'], data);
  const noCourses = isOwnProfile ? t('profile:ownProfileNoCourses') : t('profile:noCourses');
  const noResources = isOwnProfile ? t('profile:ownProfileNoResources') : t('profile:noResources');
  const noComments = isOwnProfile ? t('profile:ownProfileNoComments') : t('profile:noComments');
  const _created = R.prop('created', user);
  const joined = useDayjs(_created).startOf('m').fromNow();

  useEffect(() => {
    setSelectedBadgeProgress(initialSelectedBadgeProgress);
  }, [initialSelectedBadgeProgress]);

  const rankTooltip = isOwnProfile
    ? t('common-tooltips:ownRank', { rank, score })
    : t('common-tooltips:rank', { rank, score });

  // Order steps so that the completed ones are first.
  const profileStrengthSteps = [
    {
      label: t('profile-strength:step1'),
      href: urls.verifyAccount,
      completed: !!verified,
    },
    {
      label: t('profile-strength:step2'),
      href: urls.editProfile,
      completed: !!title && !!bio,
    },
    {
      label: t('profile-strength:step3'),
      href: urls.accountSettings,
      completed: !!school && !!subject,
    },
  ].sort((prev) => (prev.completed ? -1 : 1));

  // Calculate score for profile strength
  const profileStrengthScore = profileStrengthSteps
    .map((s) => s.completed)
    .reduce((total, completed) => (completed ? total + 1 : total), 0);

  const allStepsCompleted = !profileStrengthSteps.some((s) => !s.completed);

  // Get label for profile strength score.
  const getProfileStrengthText = (): string => {
    switch (profileStrengthScore) {
      case 0: {
        return t('profile-strength:poor');
      }

      case 1: {
        return t('profile-strength:weak');
      }

      case 2: {
        return t('profile-strength:intermediate');
      }

      case 3: {
        return t('profile-strength:strong');
      }

      default: {
        return '-';
      }
    }
  };

  const handleTabChange = (_e: ChangeEvent<Record<symbol, unknown>>, val: number): void =>
    setTabValue(val);

  const tabValueProps = {
    value: tabValue,
  };

  const renderHeaderRight = isOwnProfile && <SettingsButton />;
  const renderAvatar = <Avatar className={classes.avatar} src={mediaUrl(avatar)} />;
  const renderUsername = <Typography variant="subtitle2">{username}</Typography>;

  const renderTitle = !!title && (
    <Typography variant="subtitle2" color="textSecondary">
      {title}
    </Typography>
  );

  const renderDesktopUsername = isTabletOrDesktop && renderUsername;
  const renderDesktopTitle = isTabletOrDesktop && renderTitle;

  const renderEditProfileButton = (
    <ButtonLink
      className={classes.button}
      href={urls.editProfile}
      variant="outlined"
      endIcon={<EditOutlinedIcon />}
      fullWidth={isMobile}
    >
      {t('profile:editProfile')}
    </ButtonLink>
  );

  const renderStarredButton = (
    <ButtonLink
      className={classes.button}
      href={urls.starred}
      variant="outlined"
      endIcon={<StarBorderOutlined />}
      fullWidth={isMobile}
    >
      {t('profile:viewStarred')}
    </ButtonLink>
  );

  const renderDesktopSettingsButton = <SettingsButton className={classes.button} />;

  const renderScoreTitle = (
    <Typography variant="body2" color="textSecondary">
      {t('profile:score')}
    </Typography>
  );

  const renderCourseCountTitle = (
    <Typography variant="body2" color="textSecondary">
      {t('profile:courses')}
    </Typography>
  );

  const renderResourceCountTitle = (
    <Typography variant="body2" color="textSecondary">
      {t('profile:resources')}
    </Typography>
  );

  const renderScoreValue = (
    <Typography variant="subtitle2" className={classes.statValue}>
      {score}
    </Typography>
  );

  const renderCourseCountValue = (
    <Typography variant="subtitle2" className={classes.statValue}>
      {courseCount}
    </Typography>
  );

  const renderResourceCountValue = (
    <Typography variant="subtitle2" className={classes.statValue}>
      {resourceCount}
    </Typography>
  );

  const renderBio = !!bio && (
    <Typography className={classes.bio} variant="body2">
      {bio}
    </Typography>
  );

  const renderJoined = (
    <Typography className={classes.joined} variant="body2" color="textSecondary">
      {t('common:joined')} {joined}
    </Typography>
  );

  const renderRankEmoji = <Emoji emoji="🎖️" />;

  const renderRankLabel = (
    <>
      {rank}
      {renderRankEmoji}
    </>
  );

  const renderRank = !!rank && (
    <Box className={classes.rankContainer}>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {t('profile:rank')}
      </Typography>
      <Link href={urls.score}>
        <Tooltip title={rankTooltip}>
          <Chip className="rank-chip" size="small" label={renderRankLabel} />
        </Tooltip>
      </Link>
    </Box>
  );

  const renderBadges = !!badges.length && (
    <Box className={classes.badgeContainer}>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {t('profile:badges')}
      </Typography>
      <Grid container>
        {badges.map((badge, i) => (
          <Badge badge={badge} key={i} />
        ))}
      </Grid>
    </Box>
  );

  const onUpdateSelectedBadgeCompleted = ({
    updateSelectedBadge,
  }: UpdateSelectedBadgeMutation): void => {
    if (updateSelectedBadge?.errors?.length) {
      toggleUnexpectedErrorNotification();
    } else if (updateSelectedBadge?.badgeProgress) {
      handleCloseSelectBadgeDialog();
      setSelectedBadgeProgress(updateSelectedBadge.badgeProgress);
    } else {
      toggleUnexpectedErrorNotification();
    }
  };

  const [updateSelectedBadge] = useUpdateSelectedBadgeMutation({
    onCompleted: onUpdateSelectedBadgeCompleted,
    onError: toggleUnexpectedErrorNotification,
    context,
  });

  const handleSelectBadge = ({ id }: BadgeObjectType) => async (): Promise<void> => {
    updateSelectedBadge({ variables: { id } });
  };

  const badgeDialogHeaderProps = {
    text: t('profile:nextBadge'),
    emoji: '👀',
    onCancel: handleCloseSelectBadgeDialog,
  };

  const mapBadgeProgresses = badgeProgresses.map(
    ({ badge, progress, steps }, i) =>
      typeof steps === 'number' && (
        <Grid item xs={12} md={6}>
          <CardActionArea
            onClick={handleSelectBadge(badge)}
            className={classes.badgeCardActionArea}
          >
            <Badge badge={badge} key={i} noTooltip hoverable progress={progress} steps={steps} />
            <Typography
              className={classes.badgeDescription}
              variant="body2"
              color="textSecondary"
              gutterBottom
            >
              {badge.description}
            </Typography>
          </CardActionArea>
        </Grid>
      ),
  );

  const renderSelectBadgeDialog = (
    <SkoleDialog open={selectBadgeDialogOpen} onClose={handleCloseSelectBadgeDialog}>
      <DialogHeader {...badgeDialogHeaderProps} />
      <CardContent>
        <Grid container spacing={4}>
          {mapBadgeProgresses}
        </Grid>
      </CardContent>
    </SkoleDialog>
  );

  const renderChangeSelectedBadgeButton = (
    <Tooltip title={t('profile-tooltips:selectBadge')}>
      <IconButton
        onClick={handleOpenSelectBadgeDialog}
        className={classes.changeSelectedBadgeButton}
      >
        <SettingsOutlined className={classes.changeSelectedBadgeIcon} />
      </IconButton>
    </Tooltip>
  );

  const renderNextBadgeLabel = (
    <Typography variant="body2" color="textSecondary" gutterBottom>
      <Grid container alignItems="center">
        {t('profile:nextBadge')} {renderChangeSelectedBadgeButton}
      </Grid>
    </Typography>
  );

  const renderNextBadge = !!selectedBadgeProgress &&
    typeof selectedBadgeProgress.steps === 'number' && (
      <Badge
        badge={selectedBadgeProgress.badge}
        progress={selectedBadgeProgress.progress}
        steps={selectedBadgeProgress.steps}
      />
    );

  const renderBadgeTracking = isOwnProfile && (
    <Box className={classes.badgeContainer}>
      {renderNextBadgeLabel}
      {renderNextBadge}
    </Box>
  );

  const renderVerifyAccountLink = isOwnProfile && verified === false && (
    <TextLink className={classes.verifyAccount} href={urls.verifyAccount} color="primary">
      {t('common:verifyAccount')}
    </TextLink>
  );

  const renderProfileStrengthHeader = (
    <Typography variant="body2" color="textSecondary">
      {t('profile-strength:header')}: <strong>{getProfileStrengthText()}</strong>
    </Typography>
  );

  const renderProfileStrengthStepLabel = ({
    label,
    href,
    completed,
  }: ProfileStrengthStep): JSX.Element =>
    !completed ? (
      <TextLink href={href}>{label}</TextLink>
    ) : (
      <Typography variant="body2" color="textSecondary">
        {label}
      </Typography>
    );

  // Render uncompleted items as links and completed ones as regular text.
  const renderProfileStrengthSteps = profileStrengthSteps.map((step, i) => (
    <Step
      className={classes.step}
      key={i}
      completed={profileStrengthSteps[i].completed}
      active={false}
    >
      <StepLabel>{renderProfileStrengthStepLabel(step)}</StepLabel>
    </Step>
  ));

  // Hide stepper if all steps have been completed.
  const renderProfileStrengthStepper = !allStepsCompleted && (
    <Stepper className={classes.stepper} alternativeLabel={isMobile}>
      {renderProfileStrengthSteps}
    </Stepper>
  );

  const renderProfileStrength = isOwnProfile && (
    <Box className={classes.profileStrengthContainer}>
      {renderProfileStrengthHeader}
      {renderProfileStrengthStepper}
    </Box>
  );

  const renderDesktopActions = isTabletOrDesktop && isOwnProfile && (
    <Grid item xs={12} container alignItems="center" spacing={4}>
      {renderEditProfileButton}
      {renderStarredButton}
      {renderDesktopSettingsButton}
    </Grid>
  );

  const statsDirection = isMobile ? 'column' : 'row';

  const renderStats = (
    <Grid item container xs={12} sm={8} md={5} spacing={2} className={classes.statsContainer}>
      <Grid item xs={4} container direction={statsDirection}>
        {renderScoreValue}
        {renderScoreTitle}
      </Grid>
      <Grid item xs={4} container direction={statsDirection}>
        {renderCourseCountValue}
        {renderCourseCountTitle}
      </Grid>
      <Grid item xs={4} container direction={statsDirection}>
        {renderResourceCountValue}
        {renderResourceCountTitle}
      </Grid>
    </Grid>
  );

  const renderDesktopInfo = isTabletOrDesktop && (
    <>
      {renderBio}
      {renderRank}
      {renderBadges}
      {renderBadgeTracking}
      {renderVerifyAccountLink}
      {renderProfileStrength}
      {renderJoined}
    </>
  );

  const renderResponsiveInfo = (
    <Grid container>
      <Grid
        item
        xs={4}
        container
        direction="column"
        justify="center"
        alignItems={isMobile ? 'flex-start' : 'center'}
      >
        {renderAvatar}
        {renderDesktopUsername}
        {renderDesktopTitle}
      </Grid>
      <Grid
        item
        xs={8}
        container
        direction="column"
        wrap="nowrap"
        alignItems={isMobile ? 'center' : 'flex-start'}
      >
        {renderDesktopActions}
        {renderStats}
        {renderDesktopInfo}
      </Grid>
    </Grid>
  );

  const renderMobileInfo = isMobile && (
    <Grid container direction="column">
      {renderUsername}
      {renderTitle}
      {renderBio}
      {renderRank}
      {renderBadges}
      {renderBadgeTracking}
      {renderVerifyAccountLink}
      {renderJoined}
    </Grid>
  );

  const renderResponsiveContent = (
    <Paper className={classes.paper}>
      {renderResponsiveInfo}
      {renderMobileInfo}
    </Paper>
  );

  const renderMobileActionsCard = isMobile && isOwnProfile && (
    <Paper className={clsx(classes.paper, classes.mobileActionsCard)}>
      {renderProfileStrength}
      {renderEditProfileButton}
      {renderStarredButton}
    </Paper>
  );

  const renderCourseTableBody = <CourseTableBody courses={courses} />;
  const renderResourceTableBody = <ResourceTableBody resources={resources} />;
  const renderCommentTableBody = <CommentTableBody comments={comments} />;

  const renderCourseTable = (
    <PaginatedTable
      renderTableBody={renderCourseTableBody}
      count={courseCount}
      extraFilters={variables}
    />
  );

  const renderResourceTable = (
    <PaginatedTable
      renderTableBody={renderResourceTableBody}
      count={resourceCount}
      extraFilters={variables}
    />
  );

  const renderCommentTable = (
    <PaginatedTable
      renderTableBody={renderCommentTableBody}
      count={commentCount}
      extraFilters={variables}
    />
  );

  const renderCoursesNotFound = <NotFoundBox text={noCourses} />;
  const renderResourcesNotFound = <NotFoundBox text={noResources} />;
  const renderCommentsNotFound = <NotFoundBox text={noComments} />;
  const renderCreatedCourses = courses.length ? renderCourseTable : renderCoursesNotFound;
  const renderCreatedResources = resources.length ? renderResourceTable : renderResourcesNotFound;
  const renderCreatedComments = comments.length ? renderCommentTable : renderCommentsNotFound;

  const renderCreatedContent = (
    <Paper className={classes.createdContent}>
      <Tabs {...tabValueProps} onChange={handleTabChange}>
        <Tab label={`${t('common:courses')} (${courseCount})`} wrapped />
        <Tab label={`${t('common:resources')} (${resourceCount})`} wrapped />
        <Tab label={`${t('common:comments')} (${commentCount})`} wrapped />
      </Tabs>
      <TabPanel {...tabValueProps} index={0}>
        {renderCreatedCourses}
      </TabPanel>
      <TabPanel {...tabValueProps} index={1}>
        {renderCreatedResources}
      </TabPanel>
      <TabPanel {...tabValueProps} index={2}>
        {renderCreatedComments}
      </TabPanel>
    </Paper>
  );

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: username,
      renderHeaderRight,
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
      {renderResponsiveContent}
      {renderMobileActionsCard}
      {renderCreatedContent}
      {renderSelectBadgeDialog}
    </MainTemplate>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const apolloClient = initApolloClient();
  const t = await getT(locale, 'profile');
  const variables = R.pick(['slug'], params);
  const context = getLanguageHeaderContext(locale);
  let seoProps = {};

  try {
    const { data } = await apolloClient.query({
      query: UserSeoPropsDocument,
      variables,
      context,
    });

    const user = R.prop('user', data);

    if (!user) {
      return {
        notFound: true,
      };
    }

    const username = R.prop('username', user);

    seoProps = {
      title: username,
      description: t('description', { username }),
    };
  } catch {
    // Network error.
  }

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      _ns: await loadNamespaces(['profile', 'profile-strength', 'profile-tooltips'], locale),
      seoProps,
    },
    revalidate: MAX_REVALIDATION_INTERVAL,
  };
};

export default withUserMe(UserPage);

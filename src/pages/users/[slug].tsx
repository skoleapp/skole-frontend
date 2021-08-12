import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MaterialLink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import TableBody from '@material-ui/core/TableBody';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import EditOutlined from '@material-ui/icons/EditOutlined';
import ShareOutlined from '@material-ui/icons/ShareOutlined';
import clsx from 'clsx';
import {
  ActionRequiredTemplate,
  Badge,
  ButtonLink,
  CommentTableRow,
  DialogHeader,
  Emoji,
  ErrorTemplate,
  Link,
  LoadingTemplate,
  LoginRequiredTemplate,
  MainTemplate,
  NotFoundBox,
  PaginatedTable,
  SettingsButton,
  SkeletonCommentTableList,
  SkeletonThreadTableList,
  SkoleDialog,
  TabPanel,
  TextLink,
  ThreadTableBody,
} from 'components';
import {
  useAuthContext,
  useMediaQueryContext,
  useNotificationsContext,
  useShareContext,
} from 'context';
import {
  BadgeObjectType,
  BadgeProgressFieldsFragment,
  CommentObjectType,
  UpdateSelectedBadgeMutation,
  UserObjectType,
  useUpdateSelectedBadgeMutation,
  useUserCommentsQuery,
  useUserQuery,
  useUserThreadsQuery,
} from 'generated';
import { withUserMe } from 'hocs';
import { useDayjs, useLanguageHeaderContext, useOpen } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { BORDER_RADIUS } from 'styles';
import { MAX_REVALIDATION_INTERVAL, mediaUrl, urls } from 'utils';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  paper: {
    padding: spacing(4),
    paddingRight: `calc(${spacing(4)} + env(safe-area-inset-right))`,
    paddingLeft: `calc(${spacing(4)} + env(safe-area-inset-left))`,
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  tabs: {
    paddingRight: 'env(safe-area-inset-right)',
    paddingLeft: 'env(safe-area-inset-left)',
  },
  createdContent: {
    flexGrow: 1,
    marginTop: spacing(2),
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
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
  ownProfileStatsContainer: {
    [breakpoints.up('md')]: {
      marginTop: spacing(4),
    },
  },
  stepper: {
    padding: `${spacing(6)} 0`,
  },
  step: {
    padding: spacing(2),
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
  badgeDialogPaper: {
    overflow: 'hidden',
    [breakpoints.up('md')]: {
      paddingBottom: '3rem',
    },
  },
  badgeDialogCardContent: {
    overflowY: 'auto',
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
    [breakpoints.up('md')]: {
      marginLeft: spacing(2),
    },
  },
  mobileShareButton: {
    marginTop: spacing(2),
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
  href?: string;
  completed: boolean;
}

const ProfilePage: NextPage = () => {
  const classes = useStyles();
  const { smDown, mdUp } = useMediaQueryContext();
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const { toggleUnexpectedErrorNotification } = useNotificationsContext();
  const { handleOpenShareDialog } = useShareContext();

  const {
    userMe,
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

  const { data: userData, loading: userLoading, error: userError } = useUserQuery({
    variables,
    context,
  });

  const { data: threadsData, loading: threadsLoading, error: threadsError } = useUserThreadsQuery({
    variables,
    context,
    skip: !verified, // `true` for anonymous and unverified users.
  });

  const {
    data: commentsData,
    loading: commentsLoading,
    error: commentsError,
  } = useUserCommentsQuery({
    variables,
    context,
    skip: !verified, // `true` for anonymous and unverified users.
  });

  const error = userError || threadsError || commentsError;

  const {
    open: selectBadgeDialogOpen,
    handleOpen: handleOpenSelectBadgeDialog,
    handleClose: handleCloseSelectBadgeDialog,
  } = useOpen();

  const user: UserObjectType = R.propOr(null, 'user', userData);
  const slug = R.prop('slug', user);
  const rank: string = R.propOr('', 'rank', user);
  const username = R.prop('username', user);
  const avatar = R.prop('avatar', user);
  const title = R.prop('title', user);
  const bio = R.prop('bio', user);
  const score: number = R.propOr(0, 'score', user);
  const isOwnProfile = !!user?.id && userMe?.id === user.id;
  const badges: BadgeObjectType[] = R.propOr([], 'badges', user);
  const threadCount: number = R.propOr(0, 'threadCount', user);
  const views = R.propOr(0, 'views', user);
  const commentCount: number = R.propOr(0, 'commentCount', user);
  const threads = R.pathOr([], ['threads', 'objects'], threadsData);
  const threadsPaginationCount = R.pathOr(0, ['threads', 'count'], threadsData);
  const threadsPage = R.pathOr(1, ['threads', 'page'], threadsData);
  const comments: CommentObjectType[] = R.pathOr([], ['comments', 'objects'], commentsData);
  const commentsPaginationCount = R.pathOr(0, ['comments', 'count'], commentsData);
  const commentsPage = R.pathOr(1, ['comments', 'page'], commentsData);
  const _created = R.prop('created', user);
  const joined = useDayjs(_created).startOf('m').fromNow();

  useEffect(() => {
    setSelectedBadgeProgress(initialSelectedBadgeProgress);
  }, [initialSelectedBadgeProgress]);

  const rankTooltip = isOwnProfile
    ? t('common-tooltips:ownRank', { rank, score })
    : t('common-tooltips:rank', { rank, score });

  const noThreads =
    (verified === false && t('profile:verificationRequiredThreads')) ||
    (isOwnProfile && t('profile:ownProfileNoThreads')) ||
    t('profile:noThreads');

  const noComments =
    (verified === false && t('profile:verificationRequiredComments')) ||
    (isOwnProfile && t('profile:ownProfileNoComments')) ||
    t('profile:noComments');

  const shareDialogParams = useMemo(
    () => ({
      header: t('profile:shareHeader'),
      title: `${username} 👤`,
      text: t('profile:shareText', { username, threadCount, commentCount }),
    }),
    [t, username, threadCount, commentCount],
  );

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
      completed: comments.length > 1,
    },
  ].sort((prev) => (prev.completed ? -1 : 1));

  // Calculate score for profile strength
  const profileStrengthScore = profileStrengthSteps
    .map((s) => s.completed)
    .reduce((total, completed) => (completed ? total + 1 : total), 0);

  const allStepsCompleted = !profileStrengthSteps.some((s) => !s.completed);

  // Get label for profile strength score.
  const getProfileStrengthText = useCallback((): string => {
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
  }, [profileStrengthScore, t]);

  const handleTabChange = (_e: ChangeEvent<Record<symbol, unknown>>, val: number): void =>
    setTabValue(val);

  const tabValueProps = useMemo(
    () => ({
      value: tabValue,
    }),
    [tabValue],
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

  const handleSelectBadge = useCallback(
    ({ id }: BadgeObjectType) => async (): Promise<void> => {
      updateSelectedBadge({ variables: { id } });
    },
    [updateSelectedBadge],
  );

  const handleShareButtonClick = useCallback((): void => handleOpenShareDialog(shareDialogParams), [
    shareDialogParams,
    handleOpenShareDialog,
  ]);

  const renderAvatar = useMemo(() => <Avatar className={classes.avatar} src={mediaUrl(avatar)} />, [
    avatar,
    classes.avatar,
  ]);

  const renderUsername = useMemo(() => <Typography variant="subtitle2">{username}</Typography>, [
    username,
  ]);

  const renderTitle = useMemo(
    () =>
      !!title && (
        <Typography variant="subtitle2" color="textSecondary">
          {title}
        </Typography>
      ),
    [title],
  );

  const renderDesktopUsername = useMemo(() => mdUp && renderUsername, [mdUp, renderUsername]);
  const renderDesktopTitle = useMemo(() => mdUp && renderTitle, [mdUp, renderTitle]);

  const renderEditProfileButton = useMemo(
    () => (
      <ButtonLink
        className={classes.button}
        href={urls.editProfile}
        variant="outlined"
        endIcon={<EditOutlined />}
        fullWidth={smDown}
        size={smDown ? 'medium' : 'small'}
      >
        {t('profile:editProfile')}
      </ButtonLink>
    ),
    [classes.button, smDown, t],
  );

  const renderSettingsButton = useMemo(
    () => isOwnProfile && <SettingsButton className={classes.button} />,
    [classes.button, isOwnProfile],
  );

  const renderShareIconButton = useMemo(
    () => (
      <Tooltip title={t('profile-tooltips:share')}>
        <IconButton
          className={classes.button}
          color={smDown ? 'secondary' : 'default'}
          size="small"
          onClick={handleShareButtonClick}
        >
          <ShareOutlined />
        </IconButton>
      </Tooltip>
    ),
    [handleShareButtonClick, t, smDown, classes.button],
  );

  const renderMobileShareButton = useMemo(
    () =>
      isOwnProfile && (
        <Button
          className={clsx(classes.button, classes.mobileShareButton)}
          onClick={handleShareButtonClick}
          variant="outlined"
          endIcon={<ShareOutlined />}
          fullWidth
        >
          {t('profile:share')}
        </Button>
      ),
    [handleShareButtonClick, t, classes.button, classes.mobileShareButton, isOwnProfile],
  );

  const renderBio = useMemo(
    () =>
      !!bio && (
        <Typography className={classes.bio} variant="body2">
          {bio}
        </Typography>
      ),
    [bio, classes.bio],
  );

  const renderJoined = useMemo(
    () => (
      <Typography className={classes.joined} variant="body2" color="textSecondary">
        {t('common:joined')} {joined}
      </Typography>
    ),
    [classes.joined, joined, t],
  );

  const renderRankEmoji = useMemo(() => <Emoji emoji="🎖️" />, []);

  const renderRankLabel = useMemo(
    () => (
      <>
        {rank}
        {renderRankEmoji}
      </>
    ),
    [rank, renderRankEmoji],
  );

  const renderRank = useMemo(
    () =>
      !!rank && (
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
      ),
    [classes.rankContainer, rank, rankTooltip, renderRankLabel, t],
  );

  const renderBadges = useMemo(
    () =>
      !!badges.length && (
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
      ),
    [badges, classes.badgeContainer, t],
  );

  const mapBadgeProgresses = useMemo(
    () =>
      badgeProgresses.map(
        ({ badge, progress, steps }, i) =>
          typeof steps === 'number' && (
            <Grid item xs={12} md={6}>
              <CardActionArea
                onClick={handleSelectBadge(badge)}
                className={classes.badgeCardActionArea}
              >
                <Badge
                  badge={badge}
                  key={i}
                  noTooltip
                  hoverable
                  progress={progress}
                  steps={steps}
                />
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
      ),
    [badgeProgresses, classes.badgeCardActionArea, classes.badgeDescription, handleSelectBadge],
  );

  const badgeDialogHeaderProps = useMemo(
    () => ({
      text: t('profile:nextBadge'),
      emoji: '👀',
      onClose: handleCloseSelectBadgeDialog,
    }),
    [handleCloseSelectBadgeDialog, t],
  );

  const renderSelectBadgeDialog = useMemo(
    () =>
      !!selectedBadgeProgress && (
        <SkoleDialog
          open={selectBadgeDialogOpen}
          onClose={handleCloseSelectBadgeDialog}
          paperClasses={classes.badgeDialogPaper}
        >
          <DialogHeader {...badgeDialogHeaderProps} />
          <CardContent className={classes.badgeDialogCardContent}>
            <Grid container spacing={4}>
              {mapBadgeProgresses}
            </Grid>
          </CardContent>
        </SkoleDialog>
      ),
    [
      badgeDialogHeaderProps,
      handleCloseSelectBadgeDialog,
      mapBadgeProgresses,
      selectBadgeDialogOpen,
      selectedBadgeProgress,
      classes.badgeDialogCardContent,
      classes.badgeDialogPaper,
    ],
  );

  const renderChangeSelectedBadgeButton = useMemo(
    () => (
      <Tooltip title={t('profile-tooltips:selectBadge')}>
        <IconButton
          onClick={handleOpenSelectBadgeDialog}
          className={classes.changeSelectedBadgeButton}
        >
          <EditOutlined className={classes.changeSelectedBadgeIcon} />
        </IconButton>
      </Tooltip>
    ),
    [
      classes.changeSelectedBadgeButton,
      classes.changeSelectedBadgeIcon,
      handleOpenSelectBadgeDialog,
      t,
    ],
  );

  const renderNextBadgeLabel = useMemo(
    () =>
      !!selectedBadgeProgress && (
        <Typography variant="body2" color="textSecondary" gutterBottom>
          <Grid container alignItems="center">
            {t('profile:nextBadge')} {renderChangeSelectedBadgeButton}
          </Grid>
        </Typography>
      ),
    [renderChangeSelectedBadgeButton, t, selectedBadgeProgress],
  );

  const renderNextBadge = useMemo(
    () =>
      !!selectedBadgeProgress &&
      typeof selectedBadgeProgress.steps === 'number' && (
        <Badge
          badge={selectedBadgeProgress.badge}
          progress={selectedBadgeProgress.progress}
          steps={selectedBadgeProgress.steps}
        />
      ),
    [selectedBadgeProgress],
  );

  const renderBadgeTracking = useMemo(
    () =>
      isOwnProfile && (
        <Box className={classes.badgeContainer}>
          {renderNextBadgeLabel}
          {renderNextBadge}
        </Box>
      ),
    [classes.badgeContainer, isOwnProfile, renderNextBadge, renderNextBadgeLabel],
  );

  const renderProfileStrengthHeader = useMemo(
    () => (
      <Typography variant="body2" color="textSecondary">
        {t('profile-strength:header')}:<strong>{getProfileStrengthText()}</strong>
      </Typography>
    ),
    [getProfileStrengthText, t],
  );

  const renderProfileStrengthStepLabel = ({
    label,
    href,
    completed,
  }: ProfileStrengthStep): JSX.Element =>
    useMemo(
      () =>
        (!completed &&
          ((href && <TextLink href={href}>{label}</TextLink>) || (
            <MaterialLink>{label}</MaterialLink>
          ))) || (
          <Typography variant="body2" color="textSecondary">
            {label}
          </Typography>
        ),
      [completed, href, label],
    );

  // Render uncompleted items as links and completed ones as regular text.
  const renderProfileStrengthSteps = useMemo(
    () =>
      profileStrengthSteps.map((step, i) => (
        <Step
          className={classes.step}
          key={i}
          completed={profileStrengthSteps[i].completed}
          active={false}
        >
          <StepLabel>{renderProfileStrengthStepLabel(step)}</StepLabel>
        </Step>
      )),
    [classes.step, profileStrengthSteps],
  );

  // Hide stepper if all steps have been completed.
  const renderProfileStrengthStepper = useMemo(
    () =>
      !allStepsCompleted && (
        <Stepper className={classes.stepper} alternativeLabel={smDown}>
          {renderProfileStrengthSteps}
        </Stepper>
      ),
    [allStepsCompleted, classes.stepper, renderProfileStrengthSteps, smDown],
  );

  const renderProfileStrength = useMemo(
    () =>
      isOwnProfile && (
        <Box className={classes.profileStrengthContainer}>
          {renderProfileStrengthHeader}
          {renderProfileStrengthStepper}
        </Box>
      ),
    [
      classes.profileStrengthContainer,
      isOwnProfile,
      renderProfileStrengthHeader,
      renderProfileStrengthStepper,
    ],
  );

  const renderDesktopActions = useMemo(
    () =>
      mdUp &&
      isOwnProfile && (
        <Grid item xs={12} container alignItems="center" spacing={4}>
          {renderEditProfileButton}
          {renderSettingsButton}
          {renderShareIconButton}
        </Grid>
      ),
    [renderSettingsButton, renderEditProfileButton, mdUp, renderShareIconButton, isOwnProfile],
  );

  const renderMobileStats = useMemo(
    () =>
      smDown && (
        <>
          <Typography variant="body2" color="textSecondary">
            {score} {t('profile:score')}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {threadCount} {t('profile:threads')}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {views} {t('profile:views')}
          </Typography>
        </>
      ),
    [score, smDown, t, threadCount, views],
  );

  const renderDesktopStats = useMemo(
    () =>
      mdUp && (
        <Typography variant="body2" color="textSecondary">
          {score} {t('profile:score')} | {threadCount} {t('profile:threads')} | {views}{' '}
          {t('profile:views')}
        </Typography>
      ),
    [score, t, threadCount, views, mdUp],
  );

  const renderStats = useMemo(
    () => (
      <Grid
        item
        container
        direction="column"
        xs={12}
        className={clsx(isOwnProfile && classes.ownProfileStatsContainer)}
      >
        {renderMobileStats || renderDesktopStats}
      </Grid>
    ),
    [classes.ownProfileStatsContainer, isOwnProfile, renderMobileStats, renderDesktopStats],
  );

  const renderDesktopPublicUserShareButton = useMemo(
    () =>
      mdUp &&
      !isOwnProfile && (
        <Grid item xs={7} container>
          {renderShareIconButton}
        </Grid>
      ),
    [mdUp, renderShareIconButton, isOwnProfile],
  );

  const renderDesktopInfo = useMemo(
    () =>
      mdUp && (
        <Grid item xs={12}>
          {renderBio}
          {renderRank}
          {renderBadges}
          {renderBadgeTracking}
          {renderProfileStrength}
          {renderJoined}
        </Grid>
      ),
    [
      renderBadgeTracking,
      renderBadges,
      renderBio,
      renderJoined,
      renderProfileStrength,
      renderRank,
      mdUp,
    ],
  );

  const renderResponsiveInfo = useMemo(
    () => (
      <Grid container>
        <Grid
          item
          xs={5}
          sm={3}
          md={4}
          container
          direction="column"
          justify="center"
          alignItems={smDown ? 'flex-start' : 'center'}
        >
          {renderAvatar}
          {renderDesktopUsername}
          {renderDesktopTitle}
        </Grid>
        <Grid item xs={7} sm={9} md={8} container alignItems="center">
          {renderDesktopActions}
          {renderStats}
          {renderDesktopPublicUserShareButton}
          {renderDesktopInfo}
        </Grid>
      </Grid>
    ),
    [
      renderAvatar,
      renderDesktopActions,
      renderDesktopInfo,
      renderDesktopTitle,
      renderDesktopUsername,
      renderStats,
      smDown,
      renderDesktopPublicUserShareButton,
    ],
  );

  const renderMobileInfo = useMemo(
    () =>
      smDown && (
        <Grid container direction="column">
          {renderUsername}
          {renderTitle}
          {renderBio}
          {renderRank}
          {renderBadges}
          {renderBadgeTracking}
          {renderJoined}
        </Grid>
      ),
    [
      renderBadgeTracking,
      renderBadges,
      renderBio,
      renderJoined,
      renderRank,
      renderTitle,
      renderUsername,
      smDown,
    ],
  );

  const renderPublicUserInfo = useMemo(
    () => (
      <Paper className={classes.paper}>
        {renderResponsiveInfo}
        {renderMobileInfo}
      </Paper>
    ),
    [classes.paper, renderMobileInfo, renderResponsiveInfo],
  );

  const renderMobileActionsCard = useMemo(
    () =>
      smDown &&
      isOwnProfile && (
        <Paper className={clsx(classes.paper, classes.mobileActionsCard)}>
          {renderProfileStrength}
          {renderEditProfileButton}
          {renderMobileShareButton}
        </Paper>
      ),
    [
      classes.mobileActionsCard,
      classes.paper,
      isOwnProfile,
      renderEditProfileButton,
      renderMobileShareButton,
      renderProfileStrength,
      smDown,
    ],
  );

  const renderThreadsLoading = useMemo(() => threadsLoading && <SkeletonThreadTableList />, [
    threadsLoading,
  ]);

  const renderCommentsLoading = useMemo(() => commentsLoading && <SkeletonCommentTableList />, [
    commentsLoading,
  ]);

  const renderThreadTableBody = useMemo(() => <ThreadTableBody threads={threads} />, [threads]);

  const mapComments = useMemo(
    () => comments.map((c, i) => <CommentTableRow comment={c} key={i} />),
    [comments],
  );

  const renderCommentTableBody = useMemo(() => <TableBody>{mapComments}</TableBody>, [mapComments]);

  const renderThreadTable = useMemo(
    () =>
      threads.length && (
        <PaginatedTable
          renderTableBody={renderThreadTableBody}
          page={threadsPage}
          count={threadsPaginationCount}
          extraFilters={{ slug }}
        />
      ),
    [renderThreadTableBody, threadsPaginationCount, threadsPage, threads.length, slug],
  );

  const renderCommentTable = useMemo(
    () =>
      comments.length && (
        <PaginatedTable
          renderTableBody={renderCommentTableBody}
          page={commentsPage}
          count={commentsPaginationCount}
          extraFilters={{ slug }}
        />
      ),
    [commentsPaginationCount, commentsPage, renderCommentTableBody, comments.length, slug],
  );

  const renderThreadsNotFound = useMemo(() => noThreads && <NotFoundBox text={noThreads} />, [
    noThreads,
  ]);
  const renderCommentsNotFound = useMemo(() => noComments && <NotFoundBox text={noComments} />, [
    noComments,
  ]);

  const renderCreatedThreads = useMemo(
    () => renderThreadsLoading || renderThreadTable || renderThreadsNotFound,
    [renderThreadsLoading, renderThreadTable, renderThreadsNotFound],
  );

  const renderCreatedComments = useMemo(
    () => renderCommentsLoading || renderCommentTable || renderCommentsNotFound,
    [renderCommentsLoading, renderCommentTable, renderCommentsNotFound],
  );

  const renderCreatedContent = useMemo(
    () =>
      !!userMe && (
        <Paper className={classes.createdContent}>
          <Tabs className={classes.tabs} {...tabValueProps} onChange={handleTabChange}>
            <Tab label={`${t('common:threads')} (${threadCount})`} />
            <Tab label={`${t('common:comments')} (${commentCount})`} />
          </Tabs>
          <TabPanel {...tabValueProps} index={0}>
            {renderCreatedThreads}
          </TabPanel>
          <TabPanel {...tabValueProps} index={1}>
            {renderCreatedComments}
          </TabPanel>
        </Paper>
      ),
    [
      classes.createdContent,
      classes.tabs,
      commentCount,
      renderCreatedComments,
      renderCreatedThreads,
      t,
      tabValueProps,
      threadCount,
      userMe,
    ],
  );

  const descriptionContent = [title, bio].filter(Boolean).join(' - ');
  const layoutProps = {
    seoProps: {
      title: username,
      description: t('profile:description', { username, descriptionContent }),
      image: avatar ? mediaUrl(avatar) : undefined,
    },
    topNavbarProps: {
      header: username,
      renderHeaderRight: renderSettingsButton || renderShareIconButton,
    },
    hideBottomNavbar: !userMe,
  };

  if (userLoading) {
    return <LoadingTemplate />;
  }

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" />;
  }

  if (error) {
    return <ErrorTemplate variant="error" />;
  }

  if (!user) {
    return <ErrorTemplate variant="not-found" />;
  }

  if (!userMe) {
    return <LoginRequiredTemplate {...layoutProps}>{renderPublicUserInfo}</LoginRequiredTemplate>;
  }

  if (!verified && !isOwnProfile) {
    return <ActionRequiredTemplate variant="verify-account" {...layoutProps} />;
  }

  return (
    <MainTemplate {...layoutProps}>
      {renderPublicUserInfo}
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

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['profile', 'profile-strength', 'profile-tooltips'], locale),
  },
  revalidate: MAX_REVALIDATION_INTERVAL,
});

export default withUserMe(ProfilePage);

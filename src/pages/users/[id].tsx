import {
  Avatar,
  Box,
  Chip,
  Grid,
  makeStyles,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core';
import { EditOutlined, StarBorderOutlined } from '@material-ui/icons';
import clsx from 'clsx';
import {
  ButtonLink,
  CourseTableBody,
  ErrorTemplate,
  LoadingTemplate,
  MainTemplate,
  NotFoundBox,
  NotFoundTemplate,
  OfflineTemplate,
  PaginatedTable,
  ResourceTableBody,
  SettingsButton,
  TextLink,
} from 'components';
import { useAuthContext } from 'context';
import { BadgeObjectType, useUserQuery } from 'generated';
import { withUserMe } from 'hocs';
import { useDayjs, useLanguageHeaderContext, useMediaQueries, useSwipeableTabs } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { BORDER_RADIUS } from 'theme';
import { mediaUrl, urls } from 'utils';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  paper: {
    padding: spacing(4),
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  contentCard: {
    flexGrow: 1,
    marginTop: spacing(2),
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  avatar: {
    width: '5rem',
    height: '5rem',
    marginBottom: spacing(4),
  },
  statsContainer: {
    marginTop: spacing(2),
    marginBottom: spacing(2),
    textAlign: 'center',
  },
  statValue: {
    marginRight: spacing(1),
  },
  stepper: {
    padding: `${spacing(6)} 0`,
  },
  bio: {
    overflow: 'hidden',
    wordBreak: 'break-word',
  },
  badge: {
    margin: spacing(1),
  },
  actionButton: {
    [breakpoints.down('md')]: {
      marginTop: spacing(2),
    },
  },
}));

const UserPage: NextPage = () => {
  const { spacing } = useTheme();
  const classes = useStyles();
  const { isMobile, isTabletOrDesktop } = useMediaQueries();
  const { t } = useTranslation();
  const { tabValue, handleTabChange, handleIndexChange } = useSwipeableTabs();
  const { userMe, verified } = useAuthContext();
  const { query } = useRouter();
  const variables = R.pick(['id', 'page', 'pageSize'], query);
  const context = useLanguageHeaderContext();
  const { data, loading, error } = useUserQuery({ variables, context });
  const user = R.propOr(null, 'user', data);
  const rank = R.propOr('', 'rank', user);
  const username = R.propOr('-', 'username', user);
  const avatar = R.propOr('', 'avatar', user);
  const title = R.propOr('', 'title', user);
  const bio = R.propOr('', 'bio', user);
  const school = R.propOr('', 'school', userMe);
  const subject = R.propOr('', 'subject', userMe);
  const score = R.propOr('-', 'score')(user);
  const isOwnProfile = R.propOr('', 'id', user) === R.propOr('', 'id', userMe);
  const badges: BadgeObjectType[] = R.propOr([], 'badges', user);
  const courseCount = R.pathOr(0, ['courses', 'count'], data);
  const resourceCount = R.pathOr(0, ['resources', 'count'], data);
  const courses = R.pathOr([], ['courses', 'objects'], data);
  const resources = R.pathOr([], ['resources', 'objects'], data);
  const coursesTabLabel = isOwnProfile ? t('profile:ownProfileCourses') : t('common:courses');
  const resourcesTabLabel = isOwnProfile ? t('profile:ownProfileResources') : t('common:resources');
  const noCourses = isOwnProfile ? t('profile:ownProfileNoCourses') : t('profile:noCourses');
  const noResources = isOwnProfile ? t('profile:ownProfileNoResources') : t('profile:noResources');
  const joined = useDayjs(R.propOr('', 'created', user)).startOf('m').fromNow();

  // Order steps so that the completed ones are first.
  const profileStrengthSteps = [
    {
      label: t('profile-strength:step1'),
      completed: !!verified,
    },
    {
      label: t('profile-strength:step2'),
      completed: !!title && !!bio,
    },
    {
      label: t('profile-strength:step3'),
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
      className={classes.actionButton}
      href={urls.editProfile}
      color="primary"
      variant="outlined"
      endIcon={<EditOutlined />}
      fullWidth={isMobile}
    >
      {t('profile:editProfile')}
    </ButtonLink>
  );

  const renderViewStarredButton = (
    <ButtonLink
      className={classes.actionButton}
      href={urls.starred}
      color="primary"
      variant="outlined"
      endIcon={<StarBorderOutlined />}
      fullWidth
    >
      {t('profile:viewStarred')}
    </ButtonLink>
  );

  const renderSettingsButton = (
    <Box marginLeft={spacing(2)}>
      <Tooltip title={t('tooltips:settings')}>
        <SettingsButton color="primary" />
      </Tooltip>
    </Box>
  );

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
    <Box marginTop={spacing(1)}>
      <Typography className={classes.bio} variant="body2">
        {bio}
      </Typography>
    </Box>
  );

  const renderJoined = (
    <Box marginTop={spacing(2)}>
      <Typography variant="body2" color="textSecondary">
        {t('common:joined')} {joined}
      </Typography>
    </Box>
  );

  const renderRank = !!rank && (
    <Box marginTop={spacing(2)}>
      <Tooltip title={t('tooltips:rank', { rank })}>
        <Chip size="small" label={rank} />
      </Tooltip>
    </Box>
  );

  const renderBadges = !!badges.length && (
    <Box display="flex" margin={`${spacing(1)} -${spacing(1)} -${spacing(1)} -${spacing(1)}`}>
      {badges.map(({ name, description }, i) => (
        <Box key={i}>
          <Tooltip title={description || ''}>
            <Chip className={classes.badge} size="small" label={name} />
          </Tooltip>
        </Box>
      ))}
    </Box>
  );

  const renderVerifyAccountLink = isOwnProfile && verified === false && (
    <Box marginTop={spacing(2)}>
      <TextLink href={urls.verifyAccount} color="primary">
        {t('common:verifyAccount')}
      </TextLink>
    </Box>
  );

  const renderProfileStrengthHeader = (
    <Typography variant="body2" color="textSecondary" gutterBottom>
      {t('profile-strength:header')}: <strong>{getProfileStrengthText()}</strong>
    </Typography>
  );

  // Hide stepper is all steps have been completed.
  const renderProfileStrengthStepper = !allStepsCompleted && (
    <Stepper className={classes.stepper} alternativeLabel={isMobile}>
      {profileStrengthSteps.map(({ label }, i) => (
        <Step key={i} completed={profileStrengthSteps[i].completed} active={false}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );

  const renderProfileStrength = isOwnProfile && (
    <Box marginTop={spacing(2)}>
      {renderProfileStrengthHeader}
      {renderProfileStrengthStepper}
    </Box>
  );

  const renderDesktopActions = isTabletOrDesktop && isOwnProfile && (
    <Grid item xs={12} container alignItems="center">
      {renderEditProfileButton}
      {renderSettingsButton}
    </Grid>
  );

  const statsDirection = isMobile ? 'column' : 'row';

  const renderStats = (
    <Grid item container xs={12} sm={8} md={4} spacing={2} className={classes.statsContainer}>
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
    <Paper className={clsx(classes.paper, classes.contentCard)}>
      {renderProfileStrength}
      {renderEditProfileButton}
      {renderViewStarredButton}
    </Paper>
  );

  const commonTableHeadProps = {
    titleLeft: t('common:title'),
    titleRight: t('common:score'),
  };

  const renderCourseTableBody = <CourseTableBody courses={courses} />;
  const renderResourceTableBody = <ResourceTableBody resources={resources} />;

  const renderCourseTable = (
    <PaginatedTable
      tableHeadProps={commonTableHeadProps}
      renderTableBody={renderCourseTableBody}
      count={courseCount}
    />
  );

  const renderResourceTable = (
    <PaginatedTable
      tableHeadProps={commonTableHeadProps}
      renderTableBody={renderResourceTableBody}
      count={resourceCount}
    />
  );

  const renderCoursesNotFound = <NotFoundBox text={noCourses} />;
  const renderResourcesNotFound = <NotFoundBox text={noResources} />;
  const renderCreatedCourses = courses.length ? renderCourseTable : renderCoursesNotFound;
  const renderCreatedResources = resources.length ? renderResourceTable : renderResourcesNotFound;

  const renderTabs = (
    <Tabs value={tabValue} onChange={handleTabChange}>
      <Tab label={`${coursesTabLabel} (${courseCount})`} />
      <Tab label={`${resourcesTabLabel} (${resourceCount})`} />
    </Tabs>
  );

  const renderSwipeableViews = (
    <Box flexGrow="1" position="relative" minHeight="30rem">
      <SwipeableViews index={tabValue} onChangeIndex={handleIndexChange}>
        {renderCreatedCourses}
        {renderCreatedResources}
      </SwipeableViews>
    </Box>
  );

  const renderCreatedContent = (
    <Paper className={classes.contentCard}>
      {renderTabs}
      {renderSwipeableViews}
    </Paper>
  );

  const renderHeaderRight = isOwnProfile && <SettingsButton color="secondary" size="small" />;

  const layoutProps = {
    seoProps: {
      title: username,
      description: t('profile:description', { username }),
    },
    topNavbarProps: {
      header: username,
      dynamicBackUrl: true,
      headerRight: renderHeaderRight,
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

  if (user) {
    return (
      <MainTemplate {...layoutProps}>
        {renderResponsiveContent}
        {renderMobileActionsCard}
        {renderCreatedContent}
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
    _ns: await loadNamespaces(['profile', 'profile-strength'], locale),
  },
});

export default withUserMe(UserPage);

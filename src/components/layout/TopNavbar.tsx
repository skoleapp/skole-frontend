import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Divider from '@material-ui/core/Divider';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddCircleOutlineOutlined from '@material-ui/icons/AddCircleOutlineOutlined';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import Brightness6Outlined from '@material-ui/icons/Brightness6Outlined';
import Brightness7Outlined from '@material-ui/icons/Brightness7Outlined';
import HowToRegOutlined from '@material-ui/icons/HowToRegOutlined';
import LaunchOutlined from '@material-ui/icons/LaunchOutlined';
import NotificationsOutlined from '@material-ui/icons/NotificationsOutlined';
import StarBorderOutlined from '@material-ui/icons/StarBorderOutlined';
import clsx from 'clsx';
import { useAuthContext, useDarkModeContext, useMediaQueryContext } from 'context';
import { useTranslation } from 'lib';
import React, { MouseEvent, useCallback, useMemo, useState } from 'react';
import { BORDER_RADIUS, TOP_NAVBAR_HEIGHT_DESKTOP, TOP_NAVBAR_HEIGHT_MOBILE } from 'styles';
import { TopNavbarProps } from 'types';
import { urls } from 'utils';

import { ActivityPreview } from '../activity';
import {
  BackButton,
  ButtonLink,
  Emoji,
  IconButtonLink,
  LanguageButton,
  Link,
  Logo,
  TopNavbarSearchWidget,
} from '../shared';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
  root: {
    height: `calc(${TOP_NAVBAR_HEIGHT_MOBILE} + env(safe-area-inset-top))`,
    display: 'flex',
    justifyContent: 'center',
    [breakpoints.up('md')]: {
      height: TOP_NAVBAR_HEIGHT_DESKTOP,
    },
  },
  toolbar: {
    height: '4rem',
    [breakpoints.up('md')]: {
      paddingLeft: spacing(4),
      paddingRight: spacing(4),
    },
  },
  buttonSpacing: {
    marginLeft: spacing(1),
  },
  activityPopper: {
    zIndex: 3, // Overlap top navbar.
  },
  activityPopperPaper: {
    borderRadius: `0 0 ${BORDER_RADIUS} ${BORDER_RADIUS}`,
    padding: spacing(2),
  },
  seeAllButton: {
    marginTop: spacing(2),
  },
  score: {
    marginLeft: spacing(1),
  },
}));

export const TopNavbar: React.FC<TopNavbarProps> = ({
  header,
  emoji,
  hideBackButton,
  hideSearch,
  hideDynamicButtons,
  hideDynamicAuthButtons,
  hideLoginButton,
  hideRegisterButton,
  hideGetStartedButton,
  hideLanguageButton,
  hideDarkModeButton,
  hideLogo,
  renderHeaderRight,
  renderHeaderRightSecondary,
  renderHeaderLeft,
}) => {
  const classes = useStyles();
  const { spacing } = useTheme();
  const { t } = useTranslation();
  const { smDown, mdUp } = useMediaQueryContext();
  const { darkMode, toggleDarkMode } = useDarkModeContext();
  const dense = !!renderHeaderLeft || !!renderHeaderRightSecondary;
  const [activityPopperOpen, setActivityPopperOpen] = useState(false);
  const { verified } = useAuthContext();

  const {
    userMe,
    avatarThumbnail,
    authNetworkError,
    unreadActivityCount,
    profileUrl,
    rank,
    score,
  } = useAuthContext();

  const [activityPopperAnchorEl, setActivityPopperAnchorEl] = useState<HTMLButtonElement | null>(
    null,
  );

  const handleActivityPopperClickAway = (): void => setActivityPopperOpen(false);

  const handleActivityButtonClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>): void => {
      setActivityPopperAnchorEl(e.currentTarget);
      setActivityPopperOpen(!activityPopperOpen);
    },
    [activityPopperOpen],
  );

  const renderBackButton = useMemo(() => !hideBackButton && <BackButton />, [hideBackButton]);
  const renderEmoji = useMemo(() => !!emoji && <Emoji emoji={emoji} />, [emoji]);

  const renderHeader = useMemo(
    () =>
      !!header && (
        <Typography variant="h6" className="truncate-text">
          {header}
          {renderEmoji}
        </Typography>
      ),
    [header, renderEmoji],
  );

  const renderLogo = useMemo(() => !hideLogo && <Logo />, [hideLogo]);

  const renderLanguageButton = useMemo(
    () => !hideLanguageButton && <LanguageButton className={classes.buttonSpacing} />,
    [hideLanguageButton, classes.buttonSpacing],
  );

  const renderDarkModeButton = useMemo(
    () =>
      !hideDarkModeButton && (
        <Tooltip title={t('common-tooltips:toggleDarkMode')}>
          <IconButton className={classes.buttonSpacing} onClick={toggleDarkMode} color="secondary">
            {darkMode ? <Brightness7Outlined /> : <Brightness6Outlined />}
          </IconButton>
        </Tooltip>
      ),
    [darkMode, hideDarkModeButton, t, toggleDarkMode, classes.buttonSpacing],
  );

  const renderMobileContent = useMemo(
    () =>
      smDown && (
        <Grid container alignItems="center">
          <Grid item xs={dense ? 4 : 2} container justify="flex-start" alignItems="center">
            {renderBackButton}
            {renderHeaderLeft}
          </Grid>
          <Grid item xs={dense ? 4 : 8} container justify="center" alignItems="center">
            {renderHeader || renderLogo}
          </Grid>
          <Grid item xs={dense ? 4 : 2} container justify="flex-end" alignItems="center">
            {renderHeaderRightSecondary}
            {renderHeaderRight}
          </Grid>
        </Grid>
      ),
    [
      dense,
      renderBackButton,
      renderHeader,
      renderHeaderLeft,
      renderHeaderRight,
      renderHeaderRightSecondary,
      renderLogo,
      smDown,
    ],
  );

  const renderActivityButton = useMemo(
    () => (
      <Tooltip title={t('common-tooltips:activity', { unreadActivityCount })}>
        <IconButton
          className={classes.buttonSpacing}
          onClick={handleActivityButtonClick}
          color="secondary"
        >
          <Badge badgeContent={unreadActivityCount} color="secondary">
            <NotificationsOutlined />
          </Badge>
        </IconButton>
      </Tooltip>
    ),
    [handleActivityButtonClick, t, unreadActivityCount, classes.buttonSpacing],
  );

  const renderActivityPopper = useMemo(
    () => (
      <Popper
        open={activityPopperOpen}
        anchorEl={activityPopperAnchorEl}
        placement="bottom"
        transition
        className={classes.activityPopper}
      >
        {({ TransitionProps }): JSX.Element => (
          <Fade {...TransitionProps} timeout={500}>
            <Box marginTop={spacing(1)}>
              <Paper className={classes.activityPopperPaper}>
                <Box height="20rem" width="20rem" display="flex" flexDirection="column">
                  <ActivityPreview />
                </Box>
                <Divider />
                <ButtonLink
                  className={classes.seeAllButton}
                  href={urls.activity}
                  variant="outlined"
                  endIcon={<ArrowForwardOutlined />}
                  fullWidth
                >
                  {t('common:seeAll')}
                </ButtonLink>
              </Paper>
            </Box>
          </Fade>
        )}
      </Popper>
    ),
    [
      activityPopperAnchorEl,
      activityPopperOpen,
      classes.activityPopper,
      classes.activityPopperPaper,
      classes.seeAllButton,
      spacing,
      t,
    ],
  );

  const renderRankEmoji = useMemo(() => <Emoji emoji="🎖️" />, []);

  const renderScore = useMemo(
    () => (
      <Typography className={classes.score} variant="body2" color="textSecondary">
        {score}
      </Typography>
    ),
    [classes.score, score],
  );

  const renderRankLabel = useMemo(
    () => (
      <Grid container>
        {rank}
        {renderScore}
        {renderRankEmoji}
      </Grid>
    ),
    [rank, renderRankEmoji, renderScore],
  );

  const renderActivity = useMemo(
    () =>
      !!verified && (
        <ClickAwayListener onClickAway={handleActivityPopperClickAway}>
          <Box // ClickAway listener requires exactly one child element that cannot be a fragment.
          >
            {renderActivityButton}
            {renderActivityPopper}
          </Box>
        </ClickAwayListener>
      ),
    [renderActivityButton, renderActivityPopper, verified],
  );

  const renderStarButton = useMemo(
    () =>
      !!verified && (
        <Tooltip title={t('common-tooltips:starred')}>
          <IconButtonLink
            icon={StarBorderOutlined}
            href={urls.starred}
            className={classes.buttonSpacing}
            color="secondary"
          />
        </Tooltip>
      ),
    [verified, t, classes.buttonSpacing],
  );

  const renderRank = useMemo(
    () => (
      <Link href={urls.score}>
        <Tooltip title={t('common-tooltips:ownRank', { rank, score })}>
          <Chip className={clsx(classes.buttonSpacing, 'rank-chip')} label={renderRankLabel} />
        </Tooltip>
      </Link>
    ),
    [t, rank, renderRankLabel, score, classes.buttonSpacing],
  );

  const renderAvatar = useMemo(
    () => (
      <Tooltip title={t('common-tooltips:profile')}>
        <Typography component="span">
          <Link href={profileUrl}>
            <IconButton className={classes.buttonSpacing} color="secondary">
              <Avatar className="avatar-thumbnail" src={avatarThumbnail} />
            </IconButton>
          </Link>
        </Typography>
      </Tooltip>
    ),
    [avatarThumbnail, profileUrl, t, classes.buttonSpacing],
  );

  const renderAuthenticatedButtons = useMemo(
    () =>
      !!userMe &&
      !hideDynamicButtons &&
      !hideDynamicAuthButtons && (
        <>
          {renderActivity}
          {renderStarButton}
          {renderRank}
          {renderAvatar}
        </>
      ),
    [
      hideDynamicAuthButtons,
      hideDynamicButtons,
      renderActivity,
      renderAvatar,
      renderRank,
      renderStarButton,
      userMe,
    ],
  );

  const renderLoginButton = useMemo(
    () =>
      !hideLoginButton && (
        <ButtonLink href={urls.login} color="secondary" endIcon={<HowToRegOutlined />}>
          {t('common:login')}
        </ButtonLink>
      ),
    [hideLoginButton, t],
  );

  const renderRegisterButton = useMemo(
    () =>
      !hideRegisterButton && (
        <ButtonLink href={urls.register} color="secondary" endIcon={<AddCircleOutlineOutlined />}>
          {t('common:register')}
        </ButtonLink>
      ),
    [hideRegisterButton, t],
  );

  const renderGetStartedButton = useMemo(
    () =>
      !hideGetStartedButton && (
        <ButtonLink href={urls.index} color="secondary" endIcon={<LaunchOutlined />}>
          {t('common:getStarted')}
        </ButtonLink>
      ),
    [hideGetStartedButton, t],
  );

  const renderUnAuthenticatedButtons = useMemo(
    () =>
      !hideDynamicButtons &&
      !authNetworkError && (
        <>
          {renderLoginButton}
          {renderRegisterButton}
          {renderGetStartedButton}
        </>
      ),
    [
      authNetworkError,
      hideDynamicButtons,
      renderGetStartedButton,
      renderLoginButton,
      renderRegisterButton,
    ],
  );

  const renderSearch = useMemo(() => !hideSearch && <TopNavbarSearchWidget />, [hideSearch]);

  const renderDynamicButtons = useMemo(
    () => (userMe ? renderAuthenticatedButtons : renderUnAuthenticatedButtons),
    [renderAuthenticatedButtons, renderUnAuthenticatedButtons, userMe],
  );

  const renderDesktopContent = useMemo(
    () =>
      mdUp && (
        <Grid container alignItems="center">
          <Grid item xs={1} container>
            {renderLogo}
          </Grid>
          <Grid item xs={11} container justify="flex-end" alignItems="center">
            {renderSearch}
            {renderLanguageButton}
            {renderDarkModeButton}
            {renderDynamicButtons}
          </Grid>
        </Grid>
      ),
    [
      mdUp,
      renderDarkModeButton,
      renderDynamicButtons,
      renderLanguageButton,
      renderLogo,
      renderSearch,
    ],
  );

  const renderToolbar = useMemo(
    () => (
      <Toolbar className={classes.toolbar} variant="dense">
        {renderMobileContent}
        {renderDesktopContent}
      </Toolbar>
    ),
    [classes.toolbar, renderDesktopContent, renderMobileContent],
  );

  return <AppBar className={classes.root}>{renderToolbar}</AppBar>;
};

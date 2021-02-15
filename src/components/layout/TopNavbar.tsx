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
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddCircleOutlineOutlined from '@material-ui/icons/AddCircleOutlineOutlined';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import AssignmentOutlined from '@material-ui/icons/AssignmentOutlined';
import Brightness6Outlined from '@material-ui/icons/Brightness6Outlined';
import Brightness7Outlined from '@material-ui/icons/Brightness7Outlined';
import ChatOutlined from '@material-ui/icons/ChatOutlined';
import CloudUploadOutlined from '@material-ui/icons/CloudUploadOutlined';
import HomeOutlined from '@material-ui/icons/HomeOutlined';
import HowToRegOutlined from '@material-ui/icons/HowToRegOutlined';
import LaunchOutlined from '@material-ui/icons/LaunchOutlined';
import NotificationsOutlined from '@material-ui/icons/NotificationsOutlined';
import SchoolOutlined from '@material-ui/icons/SchoolOutlined';
import StarBorderOutlined from '@material-ui/icons/StarBorderOutlined';
import WhatshotOutlined from '@material-ui/icons/WhatshotOutlined';
import clsx from 'clsx';
import { useAuthContext, useDarkModeContext } from 'context';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import { useRouter } from 'next/router';
import React, { MouseEvent, useState } from 'react';
import {
  BORDER_RADIUS,
  TOP_NAVBAR_HEIGHT_DESKTOP,
  TOP_NAVBAR_HEIGHT_MOBILE,
  TOP_NAVBAR_HEIGHT_WITH_DESKTOP_NAVIGATION,
} from 'styles';
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

const useStyles = makeStyles(({ breakpoints, spacing, palette }) => ({
  root: {
    height: `calc(${TOP_NAVBAR_HEIGHT_MOBILE} + env(safe-area-inset-top))`,
    display: 'flex',
    justifyContent: 'center',
    [breakpoints.up('md')]: {
      height: TOP_NAVBAR_HEIGHT_WITH_DESKTOP_NAVIGATION,
      justifyContent: 'center',
    },
  },
  hideNavigation: {
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
  tabs: {
    backgroundColor: palette.type === 'dark' ? palette.background.default : palette.primary.dark,
  },
  tab: {
    borderBottom: 'none',
    color: palette.secondary.main,
    minWidth: 'auto',
    minHeight: 'auto',
    height: '100%',
    padding: `${spacing(2)} ${spacing(3)}`,
  },
  selectedTab: {
    borderBottom: `0.1rem solid ${palette.secondary.main}`,
  },
  tabWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  tabLabelIcon: {
    marginRight: '0.3rem',
    marginBottom: '0.2rem !important',
  },
  score: {
    marginLeft: spacing(1),
  },
}));

export const TopNavbar: React.FC<TopNavbarProps> = ({
  header,
  emoji,
  hideBackButton,
  hideNavigation,
  hideSearch,
  hideDynamicButtons,
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
  const { asPath } = useRouter();
  const { spacing } = useTheme();
  const { t } = useTranslation();
  const { isMobile, isTabletOrDesktop, isDesktop } = useMediaQueries();
  const { pathname } = useRouter();
  const { darkMode, toggleDarkMode } = useDarkModeContext();
  const dense = !!renderHeaderLeft || !!renderHeaderRightSecondary;
  const [activityPopperOpen, setActivityPopperOpen] = useState(false);
  const handleActivityPopperClickAway = (): void => setActivityPopperOpen(false);

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

  const handleActivityButtonClick = (e: MouseEvent<HTMLButtonElement>): void => {
    setActivityPopperAnchorEl(e.currentTarget);
    setActivityPopperOpen(!activityPopperOpen);
  };

  const renderBackButton = !hideBackButton && <BackButton />;
  const renderEmoji = !!emoji && <Emoji emoji={emoji} />;

  const renderHeader = !!header && (
    <Typography variant="h6" className="truncate-text">
      {header}
      {renderEmoji}
    </Typography>
  );

  const renderLogo = !hideLogo && <Logo />;
  const renderLanguageButton = !hideLanguageButton && <LanguageButton />;

  const renderDarkModeButton = !hideDarkModeButton && (
    <Tooltip title={t('common-tooltips:toggleDarkMode')}>
      <IconButton onClick={toggleDarkMode} color="secondary">
        {darkMode ? <Brightness7Outlined /> : <Brightness6Outlined />}
      </IconButton>
    </Tooltip>
  );

  const renderMobileContent = isMobile && (
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
        {renderHeaderRight || renderLanguageButton}
      </Grid>
    </Grid>
  );

  const renderActivityButton = (
    <Tooltip title={t('common-tooltips:activity', { unreadActivityCount })}>
      <IconButton onClick={handleActivityButtonClick} color="secondary">
        <Badge badgeContent={unreadActivityCount} color="secondary">
          <NotificationsOutlined />
        </Badge>
      </IconButton>
    </Tooltip>
  );

  const renderActivityPopper = (
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
              <Box height="20rem" width="20rem" display="flex">
                <ActivityPreview />
              </Box>
              <Divider />
              <ButtonLink
                className={classes.seeAllButton}
                href={urls.activity}
                variant="outlined"
                endIcon={<ArrowForwardOutlined />}
              >
                {t('common:seeAll')}
              </ButtonLink>
            </Paper>
          </Box>
        </Fade>
      )}
    </Popper>
  );

  const renderRankEmoji = <Emoji emoji="🎖️" />;

  const renderRankLabel = (
    <Grid container>
      {rank}
      <Typography className={classes.score} variant="body2" color="textSecondary">
        {score}
      </Typography>
      {renderRankEmoji}
    </Grid>
  );

  const renderAuthenticatedButtons = !!userMe && !hideDynamicButtons && (
    <>
      <ClickAwayListener onClickAway={handleActivityPopperClickAway}>
        <Box // ClickAway listener requires exactly one child element that cannot be a fragment.
        >
          {renderActivityButton}
          {renderActivityPopper}
        </Box>
      </ClickAwayListener>
      <Tooltip title={t('common-tooltips:starred')}>
        <IconButtonLink icon={StarBorderOutlined} href={urls.starred} color="secondary" />
      </Tooltip>
      <Link href={urls.score}>
        <Tooltip title={t('common-tooltips:ownRank', { rank, score })}>
          <Chip label={renderRankLabel} />
        </Tooltip>
      </Link>
      <Tooltip title={t('common-tooltips:profile')}>
        <Typography component="span">
          <Link href={profileUrl}>
            <IconButton color="secondary">
              <Avatar className="avatar-thumbnail" src={avatarThumbnail} />
            </IconButton>
          </Link>
        </Typography>
      </Tooltip>
    </>
  );

  const renderLoginButton = isTabletOrDesktop && !hideLoginButton && (
    <ButtonLink
      href={{
        pathname: urls.login,
        query: {
          next: asPath,
        },
      }}
      color="secondary"
      endIcon={<HowToRegOutlined />}
    >
      {t('common:login')}
    </ButtonLink>
  );

  const renderRegisterButton = isTabletOrDesktop && !hideRegisterButton && (
    <ButtonLink href={urls.register} color="secondary" endIcon={<AddCircleOutlineOutlined />}>
      {t('common:register')}
    </ButtonLink>
  );

  const renderGetStartedButton = !hideGetStartedButton && (
    <ButtonLink href={urls.index} color="secondary" endIcon={<LaunchOutlined />}>
      {t('common:getStarted')}
    </ButtonLink>
  );

  const renderUnAuthenticatedButtons = !hideDynamicButtons && !authNetworkError && (
    <>
      {renderLoginButton}
      {renderRegisterButton}
      {renderGetStartedButton}
    </>
  );

  const renderSearch = !hideSearch && isDesktop && <TopNavbarSearchWidget />;
  const renderDynamicButtons = userMe ? renderAuthenticatedButtons : renderUnAuthenticatedButtons;

  const renderDesktopContent = isTabletOrDesktop && (
    <Grid container alignItems="center">
      <Grid item xs={2} container>
        {renderLogo}
      </Grid>
      <Grid item xs={10} container justify="flex-end" alignItems="center">
        {renderSearch}
        {renderLanguageButton}
        {renderDarkModeButton}
        {renderDynamicButtons}
      </Grid>
    </Grid>
  );

  const renderToolbar = (
    <Toolbar className={classes.toolbar} variant="dense">
      {renderMobileContent}
      {renderDesktopContent}
    </Toolbar>
  );

  const tabs = [
    {
      href: urls.home,
      label: t('common:home'),
      icon: HomeOutlined,
    },
    {
      href: urls.addComment,
      label: t('common:startDiscussion'),
      icon: ChatOutlined,
    },
    {
      href: urls.search,
      label: t('common:findContent'),
      icon: AssignmentOutlined,
    },
    {
      href: urls.addCourse,
      label: t('common:addCourses'),
      icon: SchoolOutlined,
    },
    {
      href: urls.uploadResource,
      label: t('common:uploadResources'),
      icon: CloudUploadOutlined,
    },
    {
      href: urls.suggestions,
      label: t('common:suggestions'),
      icon: WhatshotOutlined,
    },
  ];

  const mapTabs = tabs.map(({ href, label, icon: Icon }) => (
    <Link href={href}>
      <Tab
        classes={{
          root: clsx(classes.tab, pathname === href && classes.selectedTab),
          wrapper: classes.tabWrapper,
        }}
        label={label}
        icon={<Icon className={classes.tabLabelIcon} />}
        selected={pathname === href}
      />
    </Link>
  ));

  const renderNavigation = isTabletOrDesktop && !hideNavigation && (
    <Tabs className={classes.tabs} variant="standard" textColor="secondary">
      {mapTabs}
    </Tabs>
  );

  return (
    <AppBar className={clsx(classes.root, hideNavigation && classes.hideNavigation)}>
      {renderToolbar}
      {renderNavigation}
    </AppBar>
  );
};

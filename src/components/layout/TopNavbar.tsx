import {
  AppBar,
  Avatar,
  Badge,
  Box,
  ClickAwayListener,
  Divider,
  Fade,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Popper,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core';
import {
  AddCircleOutlineOutlined,
  HowToRegOutlined,
  LaunchOutlined,
  NotificationsOutlined,
  SchoolOutlined,
  StarBorderOutlined,
} from '@material-ui/icons';
import { useAuthContext } from 'context';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import Link from 'next/link';
import Router from 'next/router';
import React, { MouseEvent, useState } from 'react';
import { BORDER_RADIUS, TOP_NAVBAR_HEIGHT_DESKTOP, TOP_NAVBAR_HEIGHT_MOBILE } from 'theme';
import { TopNavbarProps } from 'types';
import { urls } from 'utils';

import { ActivityPreview } from '../activity';
import { Logo } from './Logo';
import { BackButton, ButtonLink, IconButtonLink, LanguageButton } from '../shared';
import { TopNavbarSearchWidget } from './TopNavbarSearchWidget';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
  root: {
    height: `calc(${TOP_NAVBAR_HEIGHT_MOBILE} + env(safe-area-inset-top))`,
    display: 'flex',
    justifyContent: 'center',
    [breakpoints.up('md')]: {
      height: TOP_NAVBAR_HEIGHT_DESKTOP,
      justifyContent: 'center',
    },
  },
  toolbar: {
    [breakpoints.up('md')]: {
      paddingLeft: spacing(4),
      paddingRight: spacing(4),
    },
  },
  paper: {
    borderRadius: `0 0 ${BORDER_RADIUS} ${BORDER_RADIUS}`,
    padding: spacing(2),
  },
  seeAllButton: {
    marginTop: spacing(2),
  },
}));

export const TopNavbar: React.FC<TopNavbarProps> = ({
  header,
  dynamicBackUrl,
  staticBackUrl,
  hideSearch,
  hideAuthButtons,
  hideForTeachersButton,
  hideLanguageButton,
  hideLogo,
  headerRight,
  headerRightSecondary,
  headerLeft,
}) => {
  const classes = useStyles();
  const { spacing } = useTheme();
  const { t } = useTranslation();
  const { isMobile, isTabletOrDesktop, isDesktop } = useMediaQueries();
  const dense = !!headerLeft || !!headerRightSecondary;
  const [activityPopperOpen, setActivityPopperOpen] = useState(false);
  const handleActivityPopperClickAway = (): void => setActivityPopperOpen(false);

  const {
    userMe,
    userMeId,
    avatarThumbnail,
    authNetworkError,
    unreadActivityCount,
  } = useAuthContext();

  const [activityPopperAnchorEl, setActivityPopperAnchorEl] = useState<HTMLButtonElement | null>(
    null,
  );

  const handleActivityButtonClick = (e: MouseEvent<HTMLButtonElement>): void => {
    setActivityPopperAnchorEl(e.currentTarget);
    setActivityPopperOpen(!activityPopperOpen);
  };

  const renderDynamicBackButton = !!dynamicBackUrl && <BackButton onClick={() => Router.back()} />;
  const renderStaticBackButton = !!staticBackUrl && <BackButton href={staticBackUrl} />;
  const renderHeader = <Typography variant="h5">{header}</Typography>;
  const renderLogo = !hideLogo && <Logo />;
  const renderLanguageButton = !hideLanguageButton && <LanguageButton />;

  const renderMobileContent = isMobile && (
    <Grid container alignItems="center">
      <Grid item xs={dense ? 4 : 2} container justify="flex-start" alignItems="center">
        {renderStaticBackButton || renderDynamicBackButton}
        {headerLeft}
      </Grid>
      <Grid item xs={dense ? 4 : 8} container justify="center" alignItems="center">
        {header ? renderHeader : renderLogo}
      </Grid>
      <Grid item xs={dense ? 4 : 2} container justify="flex-end" alignItems="center">
        {headerRight || renderLanguageButton}
        {headerRightSecondary}
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
    >
      {({ TransitionProps }): JSX.Element => (
        <Fade {...TransitionProps} timeout={500}>
          <Box marginTop={spacing(2)}>
            <Paper className={classes.paper}>
              <Box height="20rem" width="20rem" display="flex">
                <ActivityPreview />
              </Box>
              <Divider />
              <ButtonLink
                className={classes.seeAllButton}
                href={urls.activity}
                color="primary"
                variant="outlined"
                fullWidth
              >
                {t('common:seeAll')}
              </ButtonLink>
            </Paper>
          </Box>
        </Fade>
      )}
    </Popper>
  );

  const renderForTeachersButton = !userMe && !hideForTeachersButton && (
    <ButtonLink href={urls.forTeachers} color="secondary" endIcon={<SchoolOutlined />}>
      {t('common:forTeachers')}
    </ButtonLink>
  );

  // ClickAway listener requires a single child element.
  const renderAuthenticatedButtons = !!userMe && !hideAuthButtons && (
    <>
      <ClickAwayListener onClickAway={handleActivityPopperClickAway}>
        <Box>
          {renderActivityButton}
          {renderActivityPopper}
        </Box>
      </ClickAwayListener>
      <Tooltip title={t('common-tooltips:starred')}>
        <IconButtonLink icon={StarBorderOutlined} href={urls.starred} color="secondary" />
      </Tooltip>
      <Tooltip title={t('common-tooltips:profile')}>
        <Typography component="span">
          <Link href={urls.user(userMeId)}>
            <IconButton color="secondary">
              <Avatar className="avatar-thumbnail" src={avatarThumbnail} />
            </IconButton>
          </Link>
        </Typography>
      </Tooltip>
    </>
  );

  const renderLoginButton = isDesktop && (
    <ButtonLink href={urls.login} color="secondary" endIcon={<HowToRegOutlined />}>
      {t('common:login')}
    </ButtonLink>
  );

  const renderRegisterButton = isDesktop && (
    <ButtonLink href={urls.register} color="secondary" endIcon={<AddCircleOutlineOutlined />}>
      {t('common:register')}
    </ButtonLink>
  );

  const renderGetStartedButton = (
    <ButtonLink href={urls.getStarted} color="secondary" endIcon={<LaunchOutlined />}>
      {t('common:getStarted')}
    </ButtonLink>
  );

  // Allow disabling auth buttons manually.
  // Also disable them automatically in case of a network error when authenticating/fetching user.
  const renderUnAuthenticatedButtons = !hideAuthButtons && !authNetworkError && (
    <>
      {renderLoginButton}
      {renderRegisterButton}
      {renderGetStartedButton}
    </>
  );

  const renderSearch = !hideSearch && <TopNavbarSearchWidget />;
  const renderDynamicButtons = userMe ? renderAuthenticatedButtons : renderUnAuthenticatedButtons;

  const renderDesktopContent = isTabletOrDesktop && (
    <Grid container alignItems="center">
      <Grid item xs={2} container>
        {renderLogo}
      </Grid>
      <Grid item xs={10} container justify="flex-end" alignItems="center">
        {renderSearch}
        {renderDynamicButtons}
        {renderForTeachersButton}
        {renderLanguageButton}
      </Grid>
    </Grid>
  );

  return (
    <AppBar className={classes.root}>
      <Toolbar className={classes.toolbar} variant="dense">
        {renderMobileContent}
        {renderDesktopContent}
      </Toolbar>
    </AppBar>
  );
};

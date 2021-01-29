import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
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
import HowToRegOutlined from '@material-ui/icons/HowToRegOutlined';
import LaunchOutlined from '@material-ui/icons/LaunchOutlined';
import NotificationsOutlined from '@material-ui/icons/NotificationsOutlined';
import SchoolOutlined from '@material-ui/icons/SchoolOutlined';
import StarBorderOutlined from '@material-ui/icons/StarBorderOutlined';
import { useAuthContext } from 'context';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { MouseEvent, useState } from 'react';
import { BORDER_RADIUS, TOP_NAVBAR_HEIGHT_DESKTOP, TOP_NAVBAR_HEIGHT_MOBILE } from 'theme';
import { TopNavbarProps } from 'types';
import { urls } from 'utils';

import { ActivityPreview } from '../activity';
import {
  BackButton,
  ButtonLink,
  Emoji,
  IconButtonLink,
  LanguageButton,
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
  emoji,
  hideBackButton,
  hideSearch,
  hideDynamicButtons,
  hideLoginButton,
  hideRegisterButton,
  hideGetStartedButton,
  hideForTeachersButton,
  hideLanguageButton,
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
  const dense = !!renderHeaderLeft || !!renderHeaderRightSecondary;
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

  const renderBackButton = !hideBackButton && <BackButton />;
  const renderEmoji = !!emoji && <Emoji emoji={emoji} />;

  const renderHeader = (!!header || !!emoji) && (
    <Typography variant="h6" className="truncate-text">
      {header}
      {renderEmoji}
    </Typography>
  );

  const renderLogo = !hideLogo && <Logo />;
  const renderLanguageButton = !hideLanguageButton && <LanguageButton />;

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

  const renderLoginButton = isDesktop && !hideLoginButton && (
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

  const renderRegisterButton = isDesktop && !hideRegisterButton && (
    <ButtonLink href={urls.register} color="secondary" endIcon={<AddCircleOutlineOutlined />}>
      {t('common:register')}
    </ButtonLink>
  );

  const renderGetStartedButton = !hideGetStartedButton && (
    <ButtonLink href={urls.index} color="secondary" endIcon={<LaunchOutlined />}>
      {t('common:getStarted')}
    </ButtonLink>
  );

  const renderForTeachersButton = !hideForTeachersButton && (
    <ButtonLink href={urls.forTeachers} color="secondary" endIcon={<SchoolOutlined />}>
      {t('common:forTeachers')}
    </ButtonLink>
  );

  const renderUnAuthenticatedButtons = !hideDynamicButtons && !authNetworkError && (
    <>
      {renderLoginButton}
      {renderRegisterButton}
      {renderGetStartedButton}
      {renderForTeachersButton}
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

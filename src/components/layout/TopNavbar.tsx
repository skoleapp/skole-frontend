import {
    AppBar,
    Avatar,
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
    ArrowBackOutlined,
    HowToRegOutlined,
    NotificationsOutlined,
    StarBorderOutlined,
} from '@material-ui/icons';
import { useAuthContext } from 'context';
import { useMediaQueries } from 'hooks';
import { Link, Router, useTranslation } from 'lib';
import * as R from 'ramda';
import React, { MouseEvent, useState } from 'react';
import { BORDER_RADIUS, TOP_NAVBAR_HEIGHT_DESKTOP, TOP_NAVBAR_HEIGHT_MOBILE } from 'theme';
import { TopNavbarProps } from 'types';
import { mediaURL, urls } from 'utils';

import { ActivityList, ButtonLink, IconButtonLink, Logo } from '..';
import { TopNavbarSearchWidget } from './TopNavbarSearchWidget';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
    root: {
        height: `calc(${TOP_NAVBAR_HEIGHT_MOBILE} + env(safe-area-inset-top))`,
        display: 'flex',
        justifyContent: 'flex-end',
        [breakpoints.up('lg')]: {
            height: TOP_NAVBAR_HEIGHT_DESKTOP,
            justifyContent: 'center',
        },
    },
    toolbar: {
        [breakpoints.up('lg')]: {
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
    disableSearch,
    disableAuthButtons,
    disableLogo,
    headerRight,
    headerRightSecondary,
    headerLeft,
}) => {
    const classes = useStyles();
    const { spacing } = useTheme();
    const { t } = useTranslation();
    const { isMobileOrTablet } = useMediaQueries();
    const { userMe, authNetworkError } = useAuthContext();
    const userMeId = R.propOr('', 'id', userMe);
    const [activityPopperAnchorEl, setActivityPopperAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [activityPopperOpen, setActivityPopperOpen] = useState(false);
    const avatarThumb = R.propOr('', 'avatar', userMe) as string;
    const dense = !!headerLeft || !!headerRightSecondary;
    const handleActivityPopperClickAway = (): void => setActivityPopperOpen(false);

    const handleActivityButtonClick = (e: MouseEvent<HTMLButtonElement>): void => {
        setActivityPopperAnchorEl(e.currentTarget);
        setActivityPopperOpen(!activityPopperOpen);
    };

    const renderDynamicBackButton = dynamicBackUrl && (
        <IconButton onClick={(): void => Router.back()} color="secondary" size="small">
            <ArrowBackOutlined />
        </IconButton>
    );

    const renderStaticBackButton = !!staticBackUrl && (
        <Link href={staticBackUrl.href} as={staticBackUrl.as}>
            <IconButton color="secondary" size="small">
                <ArrowBackOutlined />
            </IconButton>
        </Link>
    );

    const renderHeader = <Typography variant="h5">{header}</Typography>;
    const renderLogo = !disableLogo && <Logo />;

    const renderMobileContent = isMobileOrTablet && (
        <Grid container alignItems="center">
            <Grid item xs={dense ? 4 : 2} container justify="flex-start" alignItems="center">
                {renderStaticBackButton || renderDynamicBackButton}
                {headerLeft}
            </Grid>
            <Grid item xs={dense ? 4 : 8} container justify="center" alignItems="center">
                {header ? renderHeader : renderLogo}
            </Grid>
            <Grid item xs={dense ? 4 : 2} container justify="flex-end" alignItems="center">
                {headerRightSecondary}
                {headerRight}
            </Grid>
        </Grid>
    );

    const renderActivityButton = (
        <Tooltip title={t('tooltips:activity')}>
            <IconButton onClick={handleActivityButtonClick} color="secondary">
                <NotificationsOutlined />
            </IconButton>
        </Tooltip>
    );

    const renderActivityPopper = (
        <Popper open={activityPopperOpen} anchorEl={activityPopperAnchorEl} placement="bottom" transition>
            {({ TransitionProps }): JSX.Element => (
                <Fade {...TransitionProps} timeout={500}>
                    <Box marginTop={spacing(2)}>
                        <Paper className={classes.paper}>
                            <Box height="20rem" width="20rem" display="flex">
                                <ActivityList slice={5} />
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

    // ClickAway listener requires a single child element.
    const renderAuthenticatedButtons = !!userMe && !disableAuthButtons && (
        <>
            <ClickAwayListener onClickAway={handleActivityPopperClickAway}>
                <Box>
                    {renderActivityButton}
                    {renderActivityPopper}
                </Box>
            </ClickAwayListener>
            <Tooltip title={t('tooltips:starred')}>
                <IconButtonLink icon={StarBorderOutlined} href={urls.starred} color="secondary" />
            </Tooltip>
            <Tooltip title={t('tooltips:profile')}>
                <Typography component="span">
                    <Link href={urls.user} as={`/users/${userMeId}`}>
                        <IconButton color="secondary">
                            <Avatar className="avatar-thumbnail" src={mediaURL(avatarThumb)} />
                        </IconButton>
                    </Link>
                </Typography>
            </Tooltip>
        </>
    );

    // Allow disabling auth buttons manually.
    // Also disable them automatically in case of a network error when authenticating.
    const renderUnAuthenticatedButtons = !disableAuthButtons && !authNetworkError && (
        <>
            <ButtonLink href={urls.login} color="secondary" endIcon={<HowToRegOutlined />}>
                {t('common:login')}
            </ButtonLink>
            <ButtonLink href={urls.register} color="secondary" endIcon={<AddCircleOutlineOutlined />}>
                {t('common:register')}
            </ButtonLink>
        </>
    );

    const renderSearch = !disableSearch && !!userMe && <TopNavbarSearchWidget />;
    const renderButtons = !!userMe ? renderAuthenticatedButtons : renderUnAuthenticatedButtons;

    const renderDesktopContent = !isMobileOrTablet && (
        <Grid container alignItems="center">
            <Grid item xs={6} container>
                {renderLogo}
            </Grid>
            <Grid item xs={6} container justify="flex-end" alignItems="center">
                {renderSearch}
                {renderButtons}
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

import {
    AppBar,
    Avatar,
    Box,
    ClickAwayListener,
    Divider,
    Fade,
    Grid,
    IconButton,
    Paper,
    Popper,
    Toolbar,
    Tooltip,
} from '@material-ui/core';
import {
    ArrowBackOutlined,
    HowToRegOutlined,
    LibraryAddOutlined,
    NotificationsOutlined,
    StarBorderOutlined,
} from '@material-ui/icons';
import { useAuthContext, useDeviceContext } from 'context';
import { Link, Router, useTranslation } from 'lib';
import * as R from 'ramda';
import React, { MouseEvent, useState } from 'react';
import styled from 'styled-components';
import { breakpoints } from 'styles';
import { TopNavbarProps } from 'types';
import { mediaURL, urls } from 'utils';

import { ActivityList, ButtonLink, IconButtonLink, Logo, StyledHeaderText } from '..';
import { TopNavbarSearchWidget } from './TopNavbarSearchWidget';

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
    const { userMe, authNetworkError } = useAuthContext();
    const userMeId = R.propOr('', 'id', userMe);
    const { t } = useTranslation();
    const [activityPopperAnchorEl, setActivityPopperAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [activityPopperOpen, setActivityPopperOpen] = useState(false);
    const avatarThumb = R.propOr('', 'avatar', userMe) as string;
    const isMobile = useDeviceContext();
    const dense = !!headerLeft || !!headerRightSecondary;
    const handleActivityPopperClickAway = (): void => setActivityPopperOpen(false);

    const handleActivityButtonClick = (e: MouseEvent<HTMLButtonElement>): void => {
        setActivityPopperAnchorEl(e.currentTarget);
        setActivityPopperOpen(!activityPopperOpen);
    };

    const renderDynamicBackButton = dynamicBackUrl && (
        <IconButton onClick={(): void => Router.back()} color="secondary">
            <ArrowBackOutlined />
        </IconButton>
    );

    const renderStaticBackButton = !!staticBackUrl && (
        <Link href={staticBackUrl.href} as={staticBackUrl.as}>
            <IconButton color="secondary">
                <ArrowBackOutlined />
            </IconButton>
        </Link>
    );

    const renderHeader = <StyledHeaderText text={header} />;
    const renderLogo = !disableLogo && <Logo />;

    const renderMobileContent = isMobile && (
        <Grid container alignItems="center">
            <Grid item xs={dense ? 4 : 2} container justify="flex-start" wrap="nowrap">
                {renderStaticBackButton || renderDynamicBackButton}
                {headerLeft}
            </Grid>
            <Grid item xs={dense ? 4 : 8} container justify="center">
                {header ? renderHeader : renderLogo}
            </Grid>
            <Grid item xs={dense ? 4 : 2} container justify="flex-end">
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
                    <Box marginTop="0.5rem">
                        <Paper>
                            <Box padding="0.5rem">
                                <Box height="20rem" width="20rem" display="flex">
                                    <ActivityList slice={5} />
                                </Box>
                                <Divider />
                                <Box marginTop="0.5rem" textAlign="center">
                                    <ButtonLink href={urls.activity} color="primary" fullWidth>
                                        {t('common:seeAll')}
                                    </ButtonLink>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                </Fade>
            )}
        </Popper>
    );

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
                <span>
                    <Link href={urls.user} as={`/users/${userMeId}`}>
                        <IconButton color="secondary">
                            <Avatar className="avatar-thumbnail" src={mediaURL(avatarThumb)} />
                        </IconButton>
                    </Link>
                </span>
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
            <ButtonLink href={urls.register} color="secondary" endIcon={<LibraryAddOutlined />}>
                {t('common:register')}
            </ButtonLink>
        </>
    );

    const renderSearch = !disableSearch && !!userMe && <TopNavbarSearchWidget />;
    const renderButtons = !!userMe ? renderAuthenticatedButtons : renderUnAuthenticatedButtons;

    const renderDesktopContent = !isMobile && (
        <Grid container alignItems="center">
            <Grid item xs={6} container>
                {renderLogo}
            </Grid>
            <Grid item xs={6} container alignItems="center" justify="flex-end">
                {renderSearch}
                {renderButtons}
            </Grid>
        </Grid>
    );

    return (
        <StyledTopNavBar position="sticky">
            <Toolbar variant="dense">
                {renderMobileContent}
                {renderDesktopContent}
            </Toolbar>
        </StyledTopNavBar>
    );
};

const StyledTopNavBar = styled(AppBar)`
    height: 3rem;
    display: flex;
    justify-content: center;

    @media only screen and (min-width: ${breakpoints.MD}) {
        height: 4rem;
    }

    .MuiButton-root {
        margin: 0 0.5rem;
    }

    .MuiToolbar-root {
        @media only screen and (max-width: ${breakpoints.MD}) {
            padding: 0;
        }
    }
`;

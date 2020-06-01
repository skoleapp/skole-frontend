import { AppBar, Avatar, Grid, IconButton, Toolbar, Tooltip } from '@material-ui/core';
import { ArrowBackOutlined, HowToRegOutlined, LibraryAddOutlined, StarBorderOutlined } from '@material-ui/icons';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthContext, useDeviceContext } from 'src/context';
import styled from 'styled-components';

import { Router } from '../../i18n';
import { Link } from '../../i18n';
import { breakpoints } from '../../styles';
import { TopNavbarProps } from '../../types';
import { mediaURL } from '../../utils';
import { ButtonLink, IconButtonLink, StyledHeaderText } from '../shared';
import { Logo } from './Logo';
import { TopNavbarSearchWidget } from './TopNavbarSearchWidget';

export const TopNavbar: React.FC<TopNavbarProps> = ({
    header,
    dynamicBackUrl,
    staticBackUrl,
    disableSearch,
    headerRight,
    headerRightSecondary,
    headerLeft,
}) => {
    const { user } = useAuthContext();
    const { t } = useTranslation();
    const avatarThumb = R.propOr('', 'avatar', user) as string;
    const isMobile = useDeviceContext();
    const dense = !!headerLeft || !!headerRightSecondary;

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

    const renderMobileContent = isMobile && (
        <Grid container alignItems="center">
            <Grid item xs={dense ? 4 : 2} container justify="flex-start" wrap="nowrap">
                {renderStaticBackButton || renderDynamicBackButton}
                {headerLeft}
            </Grid>
            <Grid item xs={dense ? 4 : 8} container justify="center">
                {header ? <StyledHeaderText text={header} /> : <Logo />}
            </Grid>
            <Grid item xs={dense ? 4 : 2} container justify="flex-end">
                {headerRightSecondary}
                {headerRight}
            </Grid>
        </Grid>
    );

    const renderDesktopContent = !isMobile && (
        <Grid container alignItems="center">
            <Grid item xs={7} container>
                <Logo />
            </Grid>
            <Grid item xs={5} container alignItems="center" justify="flex-end">
                {!disableSearch && <TopNavbarSearchWidget />}
                {!!user ? (
                    <>
                        <Tooltip title={t('common:starredTooltip')}>
                            <IconButtonLink icon={StarBorderOutlined} href="/account/starred" color="secondary" />
                        </Tooltip>
                        <Tooltip title={t('common:profileTooltip')}>
                            <span>
                                <Link href="/users/[id]" as={`/users/${user.id}`}>
                                    <IconButton color="secondary">
                                        <Avatar className="avatar-thumbnail" src={mediaURL(avatarThumb)} />
                                    </IconButton>
                                </Link>
                            </span>
                        </Tooltip>
                    </>
                ) : (
                    <>
                        <ButtonLink href="/login" color="secondary" endIcon={<HowToRegOutlined />}>
                            {t('common:login')}
                        </ButtonLink>
                        <ButtonLink href="/register" color="secondary" endIcon={<LibraryAddOutlined />}>
                            {t('common:register')}
                        </ButtonLink>
                    </>
                )}
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

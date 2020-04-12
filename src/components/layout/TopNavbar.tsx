import { AppBar, Avatar, Box, Grid, IconButton, Toolbar } from '@material-ui/core';
import { ArrowBackOutlined, StarOutlined } from '@material-ui/icons';
import * as R from 'ramda';
import React from 'react';
import styled from 'styled-components';

import { useTranslation } from '../../i18n';
import { Router } from '../../i18n';
import { Link } from '../../i18n';
import { breakpoints } from '../../styles';
import { TopNavbarProps } from '../../types';
import { mediaURL, useAuth } from '../../utils';
import { ButtonLink, Heading, IconButtonLink } from '../shared';
import { Logo, TopNavbarSearchWidget } from '.';

export const TopNavbar: React.FC<TopNavbarProps> = ({
    header,
    dynamicBackUrl,
    staticBackUrl,
    disableSearch,
    headerRight,
    headerLeft,
}) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const avatarThumb = R.propOr('', 'avatar', user) as string;

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

    const renderMobileContent = (
        <Grid className="md-down" container alignItems="center">
            <Grid item xs={2} container justify="flex-start" wrap="nowrap">
                {renderStaticBackButton || renderDynamicBackButton}
                {headerLeft}
            </Grid>
            <Grid item xs={8} container justify="center">
                {header ? <Heading text={header} /> : <Logo />}
            </Grid>
            <Grid item xs={2} container justify="flex-end">
                {headerRight}
            </Grid>
        </Grid>
    );

    const renderDesktopContent = (
        <Box className="md-up" display="flex" flexGrow="1" justifyContent="space-between" alignItems="center">
            <Logo />
            <Box display="flex" alignItems="center">
                {!disableSearch && <TopNavbarSearchWidget />}
                {!!user ? (
                    <>
                        <IconButtonLink icon={StarOutlined} href="/account/starred" color="secondary" />
                        <Link href="/users/[id]" as={`/users/${user.id}`}>
                            <IconButton color="secondary">
                                <Avatar className="avatar-thumbnail" src={mediaURL(avatarThumb)} />
                            </IconButton>
                        </Link>
                    </>
                ) : (
                    <>
                        <ButtonLink href="/login" color="secondary">
                            {t('common:login')}
                        </ButtonLink>
                        <ButtonLink href="/register" color="secondary">
                            {t('common:register')}
                        </ButtonLink>
                    </>
                )}
            </Box>
        </Box>
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

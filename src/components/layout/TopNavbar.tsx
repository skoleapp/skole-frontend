import { AppBar, Box, Grid, IconButton, Toolbar, Avatar } from '@material-ui/core';
import { ArrowBack, StarOutlined } from '@material-ui/icons';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { useTranslation } from '../../i18n';
import { Router } from '../../i18n';
import { breakpoints, breakpointsNum } from '../../styles';
import { LayoutProps, State } from '../../types';
import { useBreakPoint, mediaURL } from '../../utils';
import { ButtonLink, Heading, IconButtonLink } from '../shared';
import { Logo, TopNavbarSearchWidget } from '.';
import * as R from 'ramda';
import { Link } from '../../i18n';

type Props = Pick<LayoutProps, 'heading' | 'backUrl' | 'disableSearch' | 'headerRight' | 'headerLeft'>;

export const TopNavbar: React.FC<Props> = ({ heading, backUrl, disableSearch, headerRight, headerLeft }) => {
    const { user } = useSelector((state: State) => state.auth);
    const { t } = useTranslation();
    const isMobile = useBreakPoint(breakpointsNum.MD);
    const avatarThumb = R.propOr('', 'avatar', user) as string;

    const contentProps = {
        display: 'flex',
        flexGrow: '1',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const renderMobileContent = isMobile && (
        <Grid container alignItems="center">
            <Grid item xs={2} container justify="flex-start" wrap="nowrap">
                {backUrl && (
                    <IconButton onClick={(): void => Router.back()} color="secondary">
                        <ArrowBack />
                    </IconButton>
                )}
                {headerLeft}
            </Grid>
            <Grid item xs={8}>
                {heading ? <Heading text={heading} /> : <Logo />}
            </Grid>
            <Grid item xs={2} container justify="flex-end">
                {headerRight}
            </Grid>
        </Grid>
    );

    const renderDesktopContent = !isMobile && (
        <Box {...contentProps}>
            <Logo />
            <Box display="flex" alignItems="center">
                {!disableSearch && <TopNavbarSearchWidget />}
                {!!user ? (
                    <>
                        <IconButtonLink icon={StarOutlined} href="/account/starred" color="secondary" />
                        <Link href={`/users/${user.id}`}>
                            <IconButton color="secondary">
                                <Avatar src={mediaURL(avatarThumb)} className="avatar-thumb" />
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

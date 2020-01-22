import { AppBar, Box, IconButton, Toolbar } from '@material-ui/core';
import { AccountCircle, ArrowBack, CloudUpload, SupervisedUserCircleOutlined } from '@material-ui/icons';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { Router } from '../../i18n';
import { breakpoints } from '../../styles';
import { State } from '../../types';
import { ButtonLink, IconButtonLink, SettingsButton } from '../shared';
import { Heading, Logo, TopNavbarSearchWidget } from '.';

interface Props {
    heading?: string;
    backUrl?: boolean;
    disableSearch?: boolean;
}

export const TopNavbar: React.FC<Props> = ({ heading, backUrl, disableSearch }) => {
    const { user } = useSelector((state: State) => state.auth);
    const { t } = useTranslation();
    const { pathname, query } = useRouter();

    const contentProps = {
        display: 'flex',
        flexGrow: '1',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const renderMobileContent = (
        <Box className="md-down" {...contentProps}>
            {backUrl ? (
                <IconButton onClick={(): void => Router.back()} color="secondary">
                    <ArrowBack />
                </IconButton>
            ) : (
                <IconButtonLink icon={CloudUpload} href="/upload-resource" color="secondary" />
            )}
            {heading ? <Heading text={heading} /> : <Logo />}
            {!!user && pathname === '/users/[id]' && query.id === user.id ? (
                <SettingsButton color="secondary" />
            ) : (
                <IconButtonLink href="/users" icon={SupervisedUserCircleOutlined} color="secondary" />
            )}
        </Box>
    );

    const renderDesktopContent = (
        <Box className="md-up" {...contentProps}>
            <Logo />
            <Box display="flex" alignItems="center">
                {!disableSearch && <TopNavbarSearchWidget />}
                {!!user ? (
                    <IconButtonLink icon={AccountCircle} href={`/users/${user.id}`} color="secondary" />
                ) : (
                    <>
                        <ButtonLink href="/sign-in" color="secondary">
                            {t('common:signIn')}
                        </ButtonLink>
                        <ButtonLink href="/sign-up" color="secondary">
                            {t('common:signUp')}
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
`;

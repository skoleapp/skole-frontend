import { AccountCircle, ArrowBack, CloudUpload, Settings } from '@material-ui/icons';
import { AppBar, Box, IconButton, Toolbar } from '@material-ui/core';
import { ButtonLink, IconButtonLink } from '../shared';
import { Heading, Logo, TopNavbarSearchWidget } from '.';

import React from 'react';
import { Router } from '../../i18n';
import { State } from '../../types';
import { breakpoints } from '../../styles';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

interface Props {
    heading?: string;
    backUrl?: boolean;
    disableSearch?: boolean;
}

export const TopNavbar: React.FC<Props> = ({ heading, backUrl, disableSearch }) => {
    const { user } = useSelector((state: State) => state.auth);
    const { t } = useTranslation();

    const renderLeftSection = (
        <>
            {backUrl ? (
                <IconButton className="mobile-only" onClick={(): void => Router.back()} color="secondary">
                    <ArrowBack />
                </IconButton>
            ) : (
                <IconButtonLink className="mobile-only" icon={CloudUpload} href="/upload-resource" color="secondary" />
            )}
        </>
    );

    const renderMidSection = (
        <Box className="text-section" display="flex" justifyContent="center">
            <Box className="desktop-only">
                <Logo />
            </Box>
            <Box className="mobile-only">{heading ? <Heading text={heading} /> : <Logo />}</Box>
        </Box>
    );

    const renderRightSection = (
        <>
            <Box className="desktop-only" display="flex" alignItems="center">
                {!disableSearch && <TopNavbarSearchWidget />}
                {!!user ? (
                    <IconButtonLink icon={AccountCircle} href={`/users/${user.id}`} color="secondary" />
                ) : (
                    <>
                        <ButtonLink href="/auth/sign-in" color="secondary">
                            {t('common:signIn')}
                        </ButtonLink>
                        <ButtonLink href="/auth/sign-up" color="secondary">
                            {t('common:signUp')}
                        </ButtonLink>
                    </>
                )}
            </Box>
            <IconButtonLink icon={Settings} href="/settings" color="secondary" />
        </>
    );

    return (
        <StyledTopNavBar position="sticky">
            <Toolbar variant="dense">
                {renderLeftSection}
                {renderMidSection}
                {renderRightSection}
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

    .text-section {
        flex-grow: 1;
        margin: 0 0.5rem;
        overflow: hidden;

        @media only screen and (min-width: ${breakpoints.SM}) {
            justify-content: flex-start;
        }
    }

    .MuiButton-root {
        margin: 0 0.5rem;
    }
`;

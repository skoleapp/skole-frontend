import { Box, Container } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

import { useAuthContext, useDeviceContext } from '../../context';
import { breakpoints } from '../../styles';
import { LayoutProps } from '../../types';
import {
    AttachmentViewer,
    BottomNavbar,
    CommentThreadModal,
    Footer,
    Head,
    LanguageSelectorModal,
    Notifications,
    SettingsModal,
    TopNavbar,
} from '../layout';

export const MainLayout: React.FC<LayoutProps> = ({
    seoProps,
    topNavbarProps,
    customTopNavbar,
    customBottomNavbar,
    containerProps,
    children,
}) => {
    const isMobile = useDeviceContext();
    const authenticated = !!useAuthContext().user;

    return (
        <StyledMainLayout disableBottomMargin={!authenticated && !customBottomNavbar}>
            <Head {...seoProps} />
            {(isMobile && customTopNavbar) || <TopNavbar {...topNavbarProps} />}
            <Container {...containerProps}>{children}</Container>
            {customBottomNavbar || (authenticated && <BottomNavbar />)}
            {!isMobile && <Footer />}
            <Notifications />
            <AttachmentViewer />
            <CommentThreadModal />
            <SettingsModal />
            <LanguageSelectorModal />
        </StyledMainLayout>
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledMainLayout = styled(({ disableBottomMargin, customBottomNavbar, ...other }) => <Box {...other} />)`
    background-color: var(--secondary);
    text-align: center;
    min-height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;

    .MuiContainer-root {
        padding: 0;
        flex-grow: 1;
        display: flex;
        flex-direction: column;

        @media only screen and (min-width: ${breakpoints.MD}) {
            padding: 1rem;
        }

        @media only screen and (max-width: ${breakpoints.MD}) {
            margin-bottom: ${({ disableBottomMargin }): string =>
                !disableBottomMargin ? 'calc(var(--safe-area-inset-bottom) + 3rem)' : 'initial'};
        }
    }
`;

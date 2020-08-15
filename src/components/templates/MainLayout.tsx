import { Box, Container } from '@material-ui/core';
import { useAuthContext, useDeviceContext } from 'context';
import React from 'react';
import styled from 'styled-components';
import { breakpoints } from 'styles';
import { MainLayoutProps } from 'types';

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
} from '..';

export const MainLayout: React.FC<MainLayoutProps> = ({
    seoProps,
    topNavbarProps,
    customTopNavbar,
    customBottomNavbar,
    disableBottomNavbar,
    disableFooter,
    children,
}) => {
    const isMobile = useDeviceContext();
    const { userMe } = useAuthContext();
    const layoutProps = { disableBottomMargin: !userMe && !customBottomNavbar };
    const renderHead = <Head {...seoProps} />;
    const renderTopNavbar = (isMobile && customTopNavbar) || <TopNavbar {...topNavbarProps} />;
    const renderChildren = <Container>{children}</Container>;
    const renderBottomNavbar = customBottomNavbar || (!!userMe && !disableBottomNavbar && <BottomNavbar />);
    const renderFooter = !isMobile && !disableFooter && <Footer />;
    const renderNotifications = <Notifications />;
    const renderAttachmentViewer = <AttachmentViewer />;
    const renderCommentThreadModal = <CommentThreadModal />;
    const renderSettingsModal = <SettingsModal />;
    const renderLanguageSelectorModal = <LanguageSelectorModal />;

    return (
        <StyledMainLayout {...layoutProps}>
            {renderHead}
            {renderTopNavbar}
            {renderChildren}
            {renderBottomNavbar}
            {renderFooter}
            {renderNotifications}
            {renderAttachmentViewer}
            {renderCommentThreadModal}
            {renderSettingsModal}
            {renderLanguageSelectorModal}
        </StyledMainLayout>
    );
};

// Ignore: disableBottomMargin and customBottomNavbar must be omitted from Box props.
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

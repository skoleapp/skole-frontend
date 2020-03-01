import { Box, Container, ContainerProps } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

import { breakpoints } from '../../styles';
import { LayoutProps } from '../../types';
import { Footer, Head, Notifications, Settings, SkoleGDPR, TopNavbar, BottomNavbar } from '../layout';
import { CommentThread, FileViewer } from '../layout';

interface Props extends Pick<LayoutProps, 'title' | 'backUrl' | 'disableSearch' | 'headerRight'>, ContainerProps {
    heading?: string;
    showBottomNavigation?: boolean;
}

export const MainLayout: React.FC<Props> = ({
    title,
    heading,
    backUrl,
    disableSearch,
    headerRight,
    children,
    showBottomNavigation = true,
    ...containerProps
}) => {
    return (
        <StyledMainLayout isDiscussion={showBottomNavigation}>
            <Head title={title} />
            <TopNavbar heading={heading} backUrl={backUrl} disableSearch={disableSearch} headerRight={headerRight} />
            <Container {...containerProps}>{children}</Container>
            {!!showBottomNavigation && <BottomNavbar />}
            <Footer />
            <Notifications />
            <Settings />
            <CommentThread />
            <FileViewer />
            <SkoleGDPR />
        </StyledMainLayout>
    );
};

const StyledMainLayout = styled(({ isDiscussion, ...other }) => <Box {...other} />)`
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
            margin-bottom: ${({ isDiscussion }): string => (isDiscussion ? '3rem' : 'initial')};
        }
    }
`;

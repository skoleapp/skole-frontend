import { Box, Container, ContainerProps } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

import { breakpoints } from '../../styles';
import { LayoutProps } from '../../types';
import { BottomNavbar, Footer, Head, Notifications, Settings, SkoleGDPR, TopNavbar } from '../layout';
import { CommentThread, FileViewer } from '../layout';

interface Props extends Pick<LayoutProps, 'title' | 'backUrl' | 'disableSearch' | 'headerRight'>, ContainerProps {
    heading?: string;
    customBottomNavbar?: JSX.Element;
    disableBottomNavbar?: boolean;
}

export const MainLayout: React.FC<Props> = ({
    title,
    heading,
    backUrl,
    disableSearch,
    headerRight,
    children,
    customBottomNavbar,
    disableBottomNavbar = false,
    ...containerProps
}) => {
    return (
        <StyledMainLayout disableBottomNavbar={disableBottomNavbar}>
            <Head title={title} />
            <TopNavbar heading={heading} backUrl={backUrl} disableSearch={disableSearch} headerRight={headerRight} />
            <Container {...containerProps}>{children}</Container>
            {!disableBottomNavbar && (customBottomNavbar || <BottomNavbar />)}
            <Footer />
            <Notifications />
            <Settings />
            <CommentThread />
            <FileViewer />
            <SkoleGDPR />
        </StyledMainLayout>
    );
};

const StyledMainLayout = styled(({ disableBottomNavbar, ...other }) => <Box {...other} />)`
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
            margin-bottom: ${({ disableBottomNavbar }): string => (!disableBottomNavbar ? '3rem' : 'initial')};
        }
    }
`;

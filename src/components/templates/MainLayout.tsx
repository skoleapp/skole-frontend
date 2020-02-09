import { Box, Container, ContainerProps } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

import { breakpoints } from '../../styles';
import { LayoutProps } from '../../types';
import { BottomNavbar, Footer, Head, Notifications, Settings, SkoleGDPR, TopNavbar } from '../layout';
import { CommentThread } from '../layout';

interface Props extends Pick<LayoutProps, 'title' | 'backUrl' | 'disableSearch' | 'headerRight'>, ContainerProps {
    heading?: string;
}

export const MainLayout: React.FC<Props> = ({
    title,
    heading,
    backUrl,
    disableSearch,
    headerRight,
    children,
    ...containerProps
}) => (
    <StyledMainLayout>
        <Head title={title} />
        <TopNavbar heading={heading} backUrl={backUrl} disableSearch={disableSearch} headerRight={headerRight} />
        <Container {...containerProps}>{children}</Container>
        <BottomNavbar />
        <Footer />
        <Notifications />
        <Settings />
        <CommentThread />
        <SkoleGDPR />
    </StyledMainLayout>
);

const StyledMainLayout = styled(Box)`
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

        @media only screen and (min-width: ${breakpoints.SM}) {
            padding: 1rem;
        }

        @media only screen and (max-width: ${breakpoints.SM}) {
            margin-bottom: 3rem;
        }
    }
`;

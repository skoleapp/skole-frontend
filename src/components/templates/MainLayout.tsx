import { Box, Container, ContainerProps } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

import { breakpoints } from '../../styles';
import { LayoutProps } from '../../types';
import { BottomNavbar, ResourceNavbar, Footer, Head, Notifications, Settings, SkoleGDPR, TopNavbar } from '../layout';
import { CommentThread, FileViewer } from '../layout';

interface Props extends Pick<LayoutProps, 'title' | 'backUrl' | 'disableSearch' | 'headerRight'>, ContainerProps {
    heading?: string;
    resource?: any;
}

export const MainLayout: React.FC<Props> = ({
    title,
    heading,
    backUrl,
    disableSearch,
    headerRight,
    children,
    resource,
    ...containerProps
}) => {
    const renderBottomNavbar = !!resource ? <ResourceNavbar resource={resource} /> : <BottomNavbar />;

    return (
        <StyledMainLayout>
            <Head title={title} />
            <TopNavbar heading={heading} backUrl={backUrl} disableSearch={disableSearch} headerRight={headerRight} />
            <Container {...containerProps}>{children}</Container>
            {renderBottomNavbar}
            <Footer />
            <Notifications />
            <Settings />
            <CommentThread />
            <FileViewer />
            <SkoleGDPR />
        </StyledMainLayout>
    );
};

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

        @media only screen and (min-width: ${breakpoints.MD}) {
            padding: 1rem;
        }

        @media only screen and (max-width: ${breakpoints.SM}) {
            margin-bottom: 3rem;
        }
    }
`;

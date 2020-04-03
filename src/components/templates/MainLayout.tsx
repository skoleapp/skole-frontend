import { Box, Container, ContainerProps } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

import { breakpoints, breakpointsNum } from '../../styles';
import { LayoutProps } from '../../types';
import { useBreakPoint } from '../../utils';
import { BottomNavbar, Footer, Head, LanguageSelector, Notifications, Settings, TopNavbar } from '../layout';
import { AttachmentViewer, CommentThread } from '../layout';

interface Props
    extends Pick<
            LayoutProps,
            'title' | 'backUrl' | 'disableSearch' | 'headerRight' | 'headerLeft' | 'disableBottomNavbar'
        >,
        ContainerProps {
    heading?: string;
    customBottomNavbar?: JSX.Element | boolean;
}

export const MainLayout: React.FC<Props> = ({
    title,
    heading,
    backUrl,
    disableSearch,
    headerRight,
    headerLeft,
    children,
    customBottomNavbar,
    disableBottomNavbar,
    ...containerProps
}) => {
    const isMobile = useBreakPoint(breakpointsNum.MD);

    return (
        <StyledMainLayout disableBottomMargin={disableBottomNavbar && !customBottomNavbar}>
            <Head title={title} />
            <TopNavbar
                heading={heading}
                backUrl={backUrl}
                disableSearch={disableSearch}
                headerRight={headerRight}
                headerLeft={headerLeft}
            />
            <Container {...containerProps}>{children}</Container>
            {(isMobile && customBottomNavbar) || (isMobile && !disableBottomNavbar && <BottomNavbar />)}
            {!isMobile && <Footer />}
            <Notifications />
            <Settings />
            <CommentThread />
            <AttachmentViewer />
            <LanguageSelector />
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
            margin-bottom: ${({ disableBottomMargin }): string => (!disableBottomMargin ? '3rem' : 'initial')};
        }
    }
`;

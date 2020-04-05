import { Box, Container, ContainerProps } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

import { breakpoints } from '../../styles';
import { LayoutProps } from '../../types';
import { BottomNavbar, Footer, Head, LanguageSelector, Notifications, Settings, TopNavbar } from '../layout';
import { AttachmentViewer, CommentThread } from '../layout';

interface Props
    extends Pick<
            LayoutProps,
            | 'title'
            | 'dynamicBackUrl'
            | 'staticBackUrl'
            | 'disableSearch'
            | 'headerRight'
            | 'headerLeft'
            | 'disableBottomNavbar'
        >,
        ContainerProps {
    heading?: string;
    customBottomNavbar?: JSX.Element;
}

export const MainLayout: React.FC<Props> = ({
    title,
    heading,
    dynamicBackUrl,
    staticBackUrl,
    disableSearch,
    headerRight,
    headerLeft,
    children,
    customBottomNavbar,
    disableBottomNavbar,
    ...containerProps
}) => (
    <StyledMainLayout disableBottomMargin={disableBottomNavbar && !customBottomNavbar}>
        <Head title={title} />
        <TopNavbar
            heading={heading}
            dynamicBackUrl={dynamicBackUrl}
            staticBackUrl={staticBackUrl}
            disableSearch={disableSearch}
            headerRight={headerRight}
            headerLeft={headerLeft}
        />
        <Container {...containerProps}>{children}</Container>
        {customBottomNavbar || (!disableBottomNavbar && <BottomNavbar />)}
        <Footer />
        <Notifications />
        <Settings />
        <CommentThread />
        <AttachmentViewer />
        <LanguageSelector />
    </StyledMainLayout>
);

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

import { BottomNavbar, Footer, Head, Notifications, Settings, SkoleGDPR, TopNavbar } from '../layout';
import { Box, Container } from '@material-ui/core';

import React from 'react';
import { breakpoints } from '../../styles';
import styled from 'styled-components';

interface Props {
    title?: string;
    heading?: string;
    backUrl?: boolean;
    disableSearch?: boolean;
}

export const Layout: React.FC<Props> = ({ title, heading, backUrl, disableSearch, children }) => (
    <StyledLayout>
        <Head title={title} />
        <TopNavbar heading={heading} backUrl={backUrl} disableSearch={disableSearch} />
        <Container>{children}</Container>
        <BottomNavbar />
        <Footer />
        <Notifications />
        <Settings />
        <SkoleGDPR />
    </StyledLayout>
);

const StyledLayout = styled(Box)`
    background-color: var(--secondary);
    text-align: center;
    min-height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;

    .MuiContainer-root {
        padding: 0.5rem;
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

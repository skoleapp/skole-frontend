import { Box, Container } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { BottomNavbar, Footer, Head, Notifications, SkoleGDPR, TopNavbar } from '.';
import { breakpoints } from '../../styles';

interface Props {
  title: string;
  heading?: string;
  backUrl?: string;
}

export const Layout: React.FC<Props> = ({ title, heading, backUrl, children }) => (
  <StyledLayout>
    <Head title={title} />
    <TopNavbar heading={heading} backUrl={backUrl} />
    <Container>{children}</Container>
    <BottomNavbar />
    <Footer />
    <Notifications />
    <SkoleGDPR />
  </StyledLayout>
);

const StyledLayout = styled(Box)`
  background-color: var(--secondary);
  text-align: center;
  min-height: 100vh;

  .MuiContainer-root {
    padding: 0.5rem;
    flex-grow: 1;
    margin-bottom: 10rem;

    @media only screen and (min-width: ${breakpoints.SM}) {
      padding: 1rem;
    }

    @media only screen and (max-width: ${breakpoints.SM}) {
      margin-bottom: 3rem;
    }
  }
`;

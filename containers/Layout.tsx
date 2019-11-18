import { Container } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { Footer, Head } from '../components';
import { breakpoints } from '../styles';
import { BottomNavbar } from './BottomNavbar';
import { Notifications } from './Notifications';
import { TopNavbar } from './TopNavbar';

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
    <Notifications />
    <BottomNavbar />
    <Footer />
  </StyledLayout>
);

const StyledLayout = styled.div`
  background-color: var(--secondary);
  text-align: center;

  .MuiContainer-root {
    min-height: 100vh;
    padding: 0;

    @media only screen and (min-width: ${breakpoints.SM}) {
      padding: 1rem;
    }
  }

  @media only screen and (max-width: ${breakpoints.SM}) {
    padding-bottom: 3rem;
  }
`;

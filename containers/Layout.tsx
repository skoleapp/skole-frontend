import { Container } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { Footer, Head } from '../components';
import { breakpoints } from '../styles';
import { BottomNavbar } from './BottomNavbar';
import { TopNavbar } from './TopNavbar';

interface Props {
  title: string;
  backUrl?: string;
}

export const Layout: React.FC<Props> = ({ title, backUrl, children }) => (
  <StyledLayout>
    <Head title={title} />
    <TopNavbar backUrl={backUrl} />
    <Container>{children}</Container>
    <BottomNavbar />
    <Footer />
  </StyledLayout>
);

const StyledLayout = styled.div`
  background-color: var(--secondary);
  text-align: center;

  .MuiContainer-root {
    min-height: 100vh;
    padding: 1rem;
  }

  @media only screen and (max-width: ${breakpoints.SM}) {
    padding-bottom: 3rem;
  }
`;

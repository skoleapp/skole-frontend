import { Container } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '../../styles';
import { BottomNavbar, Footer, Head, TopNavbar } from '../layout';

interface Props {
  title?: string;
}

export const Layout: React.FC<Props> = ({ title, children }) => (
  <StyledLayout>
    <Head title={title} />
    <TopNavbar />
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
    padding-bottom: 3.25rem;
  }
`;

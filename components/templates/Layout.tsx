import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { breakpoints } from '../../styles';
import { Container } from '../containers';
import { BottomNavbar, Footer, Head, TopNavbar } from '../layout';

interface Props {
  title?: string;
  children?: ReactNode;
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

  @media only screen and (max-width: ${breakpoints.SM}) {
    padding-bottom: 3rem;
  }
`;

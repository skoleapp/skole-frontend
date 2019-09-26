import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { State } from '../../interfaces';
import { Container, ErrorBoundary } from '../containers';
import { Footer, Head, MobileMenu, Navbar } from '../layout';

interface StyledMainLayoutProps {
  primary?: boolean;
  menuOpen: boolean;
}

const StyledMainLayout = styled.div<StyledMainLayoutProps>`
  background: ${({ primary }): string => (primary && 'var(--primary-bg)') || 'var(--secondary-bg)'};
  position: ${({ menuOpen }): string => (menuOpen ? 'fixed' : 'relative')};
  min-height: 100%;
  width: 100%;
`;

interface Props {
  title?: string;
  children?: ReactNode;
  primary?: boolean;
}

export const MainLayout: React.FC<Props> = ({ title, children, primary }) => {
  const { menuOpen } = useSelector((state: State) => state.ui);

  return (
    <StyledMainLayout primary={primary} menuOpen={menuOpen}>
      <Head title={title} />
      <Navbar />
      <MobileMenu />
      <Container>
        <ErrorBoundary>{children}</ErrorBoundary>
      </Container>
      <Footer />
    </StyledMainLayout>
  );
};

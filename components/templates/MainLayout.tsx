import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Container } from '../containers';
import { Footer, Head, MobileMenu, Navbar } from '../layout';

interface StyledMainLayoutProps {
  primary?: boolean;
}

const StyledMainLayout = styled.div<StyledMainLayoutProps>`
  background: ${({ primary }): string => (primary && 'var(--primary-bg)') || 'var(--secondary-bg)'};
`;

interface Props {
  title?: string;
  children?: ReactNode;
  primary?: boolean;
}

export const MainLayout: React.FC<Props> = ({ title, children, primary }) => (
  <StyledMainLayout primary={primary}>
    <Head title={title} />
    <MobileMenu />
    <Navbar />
    <Container>{children}</Container>
    <Footer />
  </StyledMainLayout>
);

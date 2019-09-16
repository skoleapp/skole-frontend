import React, { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { Container } from '../containers';
import { Footer, Head, MobileMenu, Navbar } from '../layout';

interface StyledMainLayoutProps {
  secondary?: boolean;
}

const StyledMainLayout = styled.div<StyledMainLayoutProps>`
  background: ${({ secondary }) => (secondary && 'var(--secondary-bg)') || 'var(--primary-bg)'};
`;

interface Props {
  title?: string;
  children: ReactNode;
  secondary?: boolean;
}

export const MainLayout: React.FC<Props> = ({ title, children, secondary }) => (
  <StyledMainLayout secondary={secondary}>
    <Head title={title} />
    <MobileMenu />
    <Navbar />
    <Container>{children}</Container>
    <Footer />
    <ToastContainer />
  </StyledMainLayout>
);

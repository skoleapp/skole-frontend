import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { State } from '../../interfaces';
import { Container } from '../containers';
import { BottomNavbar, Footer, Head, TopNavbar } from '../layout';

interface StyledMainLayoutProps {
  secondary?: boolean;
  menuOpen: boolean;
}

const StyledMainLayout = styled.div<StyledMainLayoutProps>`
  background: ${({ secondary }): string =>
    (secondary && 'var(--secondary-bg)') || 'var(--primary-bg)'};
  position: ${({ menuOpen }): string => (menuOpen ? 'fixed' : 'relative')};
  min-height: 100%;
  width: 100%;
`;

interface Props {
  title?: string;
  children?: ReactNode;
  secondary?: boolean;
}

export const MainLayout: React.FC<Props> = ({ title, children, secondary }) => {
  const { menuOpen } = useSelector((state: State) => state.ui);

  return (
    <StyledMainLayout secondary={secondary} menuOpen={menuOpen}>
      <Head title={title} />
      <TopNavbar />
      <Container>{children}</Container>
      <BottomNavbar />
      <Footer />
    </StyledMainLayout>
  );
};

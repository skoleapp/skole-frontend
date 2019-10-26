import React, { ReactNode } from 'react';
import { Container } from '../containers';
import { BottomNavbar, Footer, Head, TopNavbar } from '../layout';

// const StyledMainLayout = styled.div`
//   min-height: 100%;
//   width: 100%;
// `;

interface Props {
  title?: string;
  children?: ReactNode;
}

export const MainLayout: React.FC<Props> = ({ title, children }) => (
  <>
    <Head title={title} />
    <TopNavbar />
    <Container>{children}</Container>
    <BottomNavbar />
    <Footer />
  </>
);

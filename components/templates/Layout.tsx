import React, { ReactNode } from 'react';
import { Container } from '../containers';
import { BottomNavbar, Footer, Head, TopNavbar } from '../layout';

interface Props {
  title?: string;
  children?: ReactNode;
}

export const Layout: React.FC<Props> = ({ title, children }) => (
  <>
    <Head title={title} />
    <TopNavbar />
    <Container>{children}</Container>
    <BottomNavbar />
    <Footer />
  </>
);

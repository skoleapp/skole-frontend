import React, { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import { Container, IntersectingWrapper } from '../containers';
import { Background, Footer, Head, Menu, Navbar } from '../layout';

interface Props {
  title?: string;
  children: ReactNode;
}

export const MainLayout: React.FC<Props> = ({ title, children }) => (
  <IntersectingWrapper time={1}>
    <Head title={title} />
    <Background />
    <Menu />
    <Navbar />
    <Container>{children}</Container>
    <Footer />
    <ToastContainer />
  </IntersectingWrapper>
);

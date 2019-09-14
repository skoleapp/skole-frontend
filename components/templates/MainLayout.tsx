import React, { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import { Container } from '../containers';
import { Footer, Head, MobileMenu, Navbar } from '../layout';

interface Props {
  title?: string;
  children: ReactNode;
}

export const MainLayout: React.FC<Props> = ({ title, children }) => (
  <>
    <Head title={title} />
    <MobileMenu />
    <Navbar />
    <Container>{children}</Container>
    <Footer />
    <ToastContainer />
  </>
);

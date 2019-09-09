import React, { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import { Background, Container, Footer, Menu, Navbar } from '../molecules';
import { Head } from '../organisms';

interface Props {
  title?: string;
  children: ReactNode;
}

export const Layout: React.FC<Props> = ({ title, children }) => (
  <>
    <Head title={title} />
    <Background />
    <Menu />
    <Navbar />
    <Container>{children}</Container>
    <Footer />
    <ToastContainer />
  </>
);

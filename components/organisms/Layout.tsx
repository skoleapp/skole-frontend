import React, { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import { Background, Container, Menu, Navbar } from '../molecules';
import { Head } from '../organisms';

interface Props {
  title?: string;
  children: ReactNode;
}

export const Layout: React.FC<Props> = ({ title, children }) => (
  <Container>
    <Head title={title} />
    <Navbar />
    <Menu />
    <Background />
    {children}
    <ToastContainer />
  </Container>
);

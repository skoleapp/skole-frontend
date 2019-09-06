import React, { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import { Background } from '../atoms';
import { Head, TopHeader } from '../organisms';

interface Props {
  title: string;
  children: ReactNode;
}

export const Layout: React.FC<Props> = ({ title, children }) => (
  <>
    <Head title={title} />
    <TopHeader />
    <Background />
    {children}
    <ToastContainer />
  </>
);

import React, { ReactNode } from 'react';
import { Background } from '../atoms';
import { Head, TopHeader } from '../organisms';

interface Props {
  title: string;
  children: ReactNode;
}

export const Layout: React.SFC<Props> = ({ title, children }) => (
  <>
    <Head title={title} />
    <TopHeader />
    <Background />
    {children}
  </>
);

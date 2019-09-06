import React, { ReactNode } from 'react';
import { Head } from '../organisms';

interface Props {
  title: string;
  children: ReactNode;
}

export const Layout: React.SFC<Props> = ({ title, children }) => (
  <>
    <Head title={title} />
    <div>{children}</div>
  </>
);

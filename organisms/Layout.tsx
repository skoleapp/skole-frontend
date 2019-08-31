import React from 'react';
import { Head } from '.';

interface Props {
  title: string;
  children: JSX.Element | string;
}

export const Layout: React.SFC<Props> = ({ title, children }) => (
  <>
    <Head title={title} />
    <div>{children}</div>
  </>
);

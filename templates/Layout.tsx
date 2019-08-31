import React from 'react';
import { Head } from '../organisms';

interface Props {
    title: string;
    children: JSX.Element | string;
}

export const Layout: React.SFC<Props> = ({ title, children }) => (
    <React.Fragment>
        <Head title={title} />
        <div>{children}</div>
    </React.Fragment>
);

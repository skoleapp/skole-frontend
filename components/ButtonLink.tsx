import { Button } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import Link from 'next/link';
import React from 'react';

interface Props extends ButtonProps {
  href: any;
}

export const ButtonLink: React.FC<Props> = ({ href, children, ...props }) => (
  <Link href={href}>
    <Button {...props}>{children}</Button>
  </Link>
);

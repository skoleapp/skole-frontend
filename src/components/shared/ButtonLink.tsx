import { Button } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import { LinkProps } from 'next/link';
import React from 'react';
import { Link } from '../../i18n';

type Props = LinkProps & Omit<ButtonProps, 'href'>;

export const ButtonLink: React.FC<Props> = ({ href, children, ...props }) => (
  <Link href={href}>
    <Button {...props}>{children}</Button>
  </Link>
);

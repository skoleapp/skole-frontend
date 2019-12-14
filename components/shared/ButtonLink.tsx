import { Button } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import { LinkProps } from 'next/link';
import { Link } from '../../i18n';

import React from 'react';

type Props = LinkProps & Omit<ButtonProps, 'href'>;

export const ButtonLink: React.FC<Props> = ({ href, children, ...props }) => (
  <Link href={href}>
    <Button {...props}>{children}</Button>
  </Link>
);

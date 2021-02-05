import { ButtonProps } from '@material-ui/core/Button';
import Link, { LinkProps } from 'next/link';
import React from 'react';

import { SkoleButton } from './SkoleButton';

type Props = LinkProps & Omit<ButtonProps, 'href'>;

export const ButtonLink: React.FC<Props> = ({ href, children, ...props }) => (
  <Link href={href}>
    <SkoleButton {...props}>{children}</SkoleButton>
  </Link>
);

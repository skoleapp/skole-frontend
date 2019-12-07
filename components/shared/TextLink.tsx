import { Link as MaterialLink } from '@material-ui/core';
import { LinkProps as MaterialLinkProps } from '@material-ui/core/Link';
import Link, { LinkProps } from 'next/link';
import React from 'react';

type Props = LinkProps & Omit<MaterialLinkProps, 'href'>;

export const TextLink: React.FC<Props> = ({ href, children, ...props }) => (
  <Link href={href}>
    <MaterialLink {...props}>{children}</MaterialLink>
  </Link>
);

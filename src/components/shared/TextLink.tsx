import MaterialLink, { LinkProps as MaterialLinkProps } from '@material-ui/core/Link';
import { LinkProps } from 'next/link';
import React from 'react';

import { Link } from './Link';

type Props = LinkProps & Omit<MaterialLinkProps, 'href'>;

export const TextLink: React.FC<Props> = ({ href, children, ...props }) => (
  <Link href={href} passHref>
    <MaterialLink {...props}>{children}</MaterialLink>
  </Link>
);

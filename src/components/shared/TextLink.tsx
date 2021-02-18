import MaterialLink, { LinkProps as MaterialLinkProps } from '@material-ui/core/Link';
import Link, { LinkProps } from 'next/link';
import React from 'react';

type Props = LinkProps & Omit<MaterialLinkProps, 'href'>;

// `next/link` is being used here on purpose as the `MaterialLink` is already an anchor tag.
export const TextLink: React.FC<Props> = ({ href, children, ...props }) => (
  <Link href={href} passHref>
    <MaterialLink {...props}>{children}</MaterialLink>
  </Link>
);

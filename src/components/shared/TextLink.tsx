import { Link as MaterialLink } from '@material-ui/core';
import { LinkProps as MaterialLinkProps } from '@material-ui/core/Link';
import { Link } from 'lib';
import { LinkProps } from 'next/link';
import React from 'react';

type Props = LinkProps & Omit<MaterialLinkProps, 'href'>;

export const TextLink: React.FC<Props> = ({ href, as, children, ...props }) => (
    <Link href={href} as={as} passHref>
        <MaterialLink {...props}>{children}</MaterialLink>
    </Link>
);

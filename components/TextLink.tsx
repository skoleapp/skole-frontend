import { Link as MaterialLink } from '@material-ui/core';
import { LinkProps as MaterialLinkProps } from '@material-ui/core/Link';
import Link, { LinkProps } from 'next/link';
import React from 'react';
import styled from 'styled-components';

type Props = LinkProps & Omit<MaterialLinkProps, 'href'>;

export const TextLink: React.FC<Props> = ({ href, children, ...props }) => (
  <StyledTextLink>
    <Link href={href}>
      <MaterialLink {...props}>{children}</MaterialLink>
    </Link>
  </StyledTextLink>
);

const StyledTextLink = styled.span`
  .MuiLink-root {
    cursor: pointer;
  }
`;

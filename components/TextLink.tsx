import { Link as MaterialLink } from '@material-ui/core';
import { LinkProps } from '@material-ui/core/Link';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

interface Props extends LinkProps {
  href: string;
}

export const TextLink: React.FC<Props> = ({ href, children, ...props }) => (
  <StyledTextLink>
    <Link href={href}>
      <MaterialLink {...props}>{children}</MaterialLink>
    </Link>
  </StyledTextLink>
);

const StyledTextLink = styled.div`
  margin: 0.25rem 0;

  .MuiLink-root {
    cursor: pointer;
  }
`;

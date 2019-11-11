import { Card, Typography } from '@material-ui/core';
import { SvgIconComponent } from '@material-ui/icons';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

interface ShortcutProps {
  text: string;
  icon?: SvgIconComponent;
  href: string;
}

export const Shortcut: React.FC<ShortcutProps> = ({ text, icon: Icon, href }) => (
  <Link href={href}>
    <StyledShortcut>
      {Icon && <Icon />}
      <Typography variant="body1">{text}</Typography>
    </StyledShortcut>
  </Link>
);

const StyledShortcut = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 14rem;
  width: 14rem;
  font-size: 1.5rem;
  margin: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: var(--transition);

  svg {
    height: 3rem;
    width: 3rem;
  }

  &:hover {
    background-color: var(--light-opacity);
  }
`;

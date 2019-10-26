import { Card, Typography } from '@material-ui/core';
import { SvgIconComponent } from '@material-ui/icons';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

const StyledShortcut = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 10rem;
  width: 10rem;
  font-size: 1.5rem;
  margin: 1rem;
  padding: 0.5rem;

  &:hover {
    transition: var(--transition);
    transform: var(--scale);
    cursor: pointer;
  }
`;

interface ShortcutProps {
  text: string;
  icon: SvgIconComponent;
  href: string;
}

export const Shortcut: React.FC<ShortcutProps> = ({ text, icon: Icon, href }) => (
  <Link href={href}>
    <StyledShortcut>
      <Icon />
      <Typography variant="body1">{text}</Typography>
    </StyledShortcut>
  </Link>
);

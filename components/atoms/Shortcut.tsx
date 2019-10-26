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
  height: 12rem;
  width: 12rem;
  font-size: 1.5rem;
  margin: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--light-opacity);
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

import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { Card } from './Card';
import { Icon } from './icons';

const StyledCard = styled(Card)`
  height: 12rem;
  width: 12rem;
  font-size: 1.5rem;
  margin: 1rem;

  &:hover {
    transition: var(--transition);
    transform: var(--scale);
    cursor: pointer;
  }
`;

interface ShortcutProps {
  text: string;
  iconName: string;
  href: string;
}

export const Shortcut: React.FC<ShortcutProps> = ({ text, iconName, href }) => (
  <Link href={href}>
    <StyledCard>
      <Icon iconName={iconName} iconSize="3" />
      <p>{text}</p>
    </StyledCard>
  </Link>
);

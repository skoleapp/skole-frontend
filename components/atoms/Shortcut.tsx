import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { ShortcutProps } from '../../interfaces';
import { Card } from './Card';
import { Icon } from './Icon';

const StyledCard = styled(Card)`
  height: 14rem;
  width: 14rem;
  font-size: 1.5rem;
  margin: 1rem;

  &:hover {
    transition: var(--transition);
    transform: var(--scale);
    cursor: pointer;
  }
`;

export const Shortcut: React.FC<ShortcutProps> = ({ text, iconName, href }) => (
  <Link href={href}>
    <StyledCard>
      <Icon iconName={iconName} iconSize="3" />
      <p>{text}</p>
    </StyledCard>
  </Link>
);

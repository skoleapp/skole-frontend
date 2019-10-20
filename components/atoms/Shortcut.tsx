import { SvgIconComponent } from '@material-ui/icons';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { Card } from './Card';
import { ShortcutIcon } from './icons';

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
  icon: SvgIconComponent;
  href: string;
}

export const Shortcut: React.FC<ShortcutProps> = ({ text, icon, href }) => (
  <Link href={href}>
    <StyledCard>
      <ShortcutIcon icon={icon} />
      <p>{text}</p>
    </StyledCard>
  </Link>
);

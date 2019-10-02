import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { ShortcutProps } from '../../interfaces';
import { Column } from '../containers';
import { Icon } from './Icon';

const StyledShortcut = styled.div`
  margin: 0.5rem;
  padding: 0.5rem;
  height: 14rem;
  width: 14rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--border-radius);
  border: var(--black-border)
  color: var(--black);
  font-size: 1.5rem;
  background: var(--white);
  box-shadow: var(--box-shadow);

  &:hover {
    transition: var(--transition);
    transform: var(--scale);
    border-color: var(--primary);
    cursor: pointer;
  }
`;

export const Shortcut: React.FC<ShortcutProps> = ({ text, iconName, href }) => (
  <Link href={href}>
    <StyledShortcut>
      <Column>
        <Icon iconName={iconName} iconSize="3" />
        <p>{text}</p>
      </Column>
    </StyledShortcut>
  </Link>
);

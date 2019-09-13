import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { Column } from '../containers';

const StyledSearchItemShortcut = styled.div`
  margin: 0.5rem;
  padding: 0.5rem;
  height: 12.5rem;
  width: 12.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 0.75rem;
  border: 0.1rem solid var(--black);
  color: var(--black);
  font-size: 1.5rem;
  background: var(--primary);

  &:hover {
    transition: var(--transition);
    transform: var(--scale);
    background: var(--secondary);
    color: var(--primary);
    border-color: var(--primary);
  }
`;

interface Props {
  text: string;
  iconName: string;
  href: string;
}

export const SearchItemShortcut: React.FC<Props> = ({ text, iconName, href }) => (
  <Link href={href}>
    <StyledSearchItemShortcut>
      <Column>
        <i className={`fas fa-2x fa-${iconName}`} />
        <p>{text}</p>
      </Column>
    </StyledSearchItemShortcut>
  </Link>
);

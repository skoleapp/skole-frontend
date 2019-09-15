import Link from 'next/link';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { toggleMenu } from '../../redux';
import { Anchor } from './Anchor';

const StyledMenuListItem = styled.li`
  list-style: none;
  color: var(--white);
  font-size: 1.75rem;
  line-height: 1.5;

  &:hover {
    transform: var(--scale);
    transition: var(--transition);
  }

  a:hover {
    text-decoration: none !important;
    color: var(--black);
  }
`;

interface Props {
  href: string;
}

export const MenuListItem: React.FC<Props> = ({ href, children }) => {
  const dispatch = useDispatch();

  return (
    <Link href={href}>
      <StyledMenuListItem
        onClick={(): void => {
          dispatch(toggleMenu(false));
        }}
      >
        <Anchor variant="white">{children}</Anchor>
      </StyledMenuListItem>
    </Link>
  );
};

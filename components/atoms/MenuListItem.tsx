import Link from 'next/link';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { logout, toggleMenu } from '../../redux';
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

  const onClick = (href: string): void => {
    dispatch(toggleMenu(false));

    if (href === '/logout') {
      dispatch(logout());
    }
  };

  return (
    <Link href={href}>
      <StyledMenuListItem onClick={(): void => onClick(href)}>
        <Anchor variant="white">{children}</Anchor>
      </StyledMenuListItem>
    </Link>
  );
};

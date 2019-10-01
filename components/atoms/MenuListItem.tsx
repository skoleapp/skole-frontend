import Link from 'next/link';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { closeWidgets } from '../../redux';
import { Anchor } from './Anchor';

const StyledMenuListItem = styled(Anchor)`
  font-size: 1.5rem;
  line-height: 0.75;

  &:hover {
    transform: var(--scale);
    transition: var(--transition);
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
          dispatch(closeWidgets());
        }}
        variant="white"
      >
        {children}
      </StyledMenuListItem>
    </Link>
  );
};

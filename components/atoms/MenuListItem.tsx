import Link from 'next/link';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { closeWidgets } from '../../actions';
import { Anchor } from './Anchor';

const StyledMenuListItem = styled(Anchor)`
  font-size: 1.5rem;
  line-height: 0.75;

  &:hover {
    transform: var(--scale);
    transition: var(--transition);
    text-decoration: none;
  }
`;

interface Props {
  href: string;
  onClick?: () => any;
}

export const MenuListItem: React.FC<Props> = ({ href, onClick, children }) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(closeWidgets());

    if (onClick) {
      onClick();
    }
  };

  return (
    <Link href={href ? href : '#'}>
      <StyledMenuListItem onClick={handleClick} variant="white">
        {children}
      </StyledMenuListItem>
    </Link>
  );
};

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { toggleMenu } from '../../redux';
import { Redirect } from '../utils';
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
  const [redirecting, setRedirecting] = useState(false);

  if (redirecting) {
    return <Redirect to={href} />;
  }

  return (
    <StyledMenuListItem
      onClick={(): void => {
        dispatch(toggleMenu(false));
        setRedirecting(true);
      }}
    >
      <Anchor variant="white">{children}</Anchor>
    </StyledMenuListItem>
  );
};

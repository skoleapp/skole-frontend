import React from 'react';
import styled from 'styled-components';
import { IconProps } from '../../interfaces';
import { Icon } from '../atoms/Icon';

const StyledNavbarIcon = styled.div`
  i:hover {
    transform: var(--scale);
    transition: var(--transition);
    color: var(--black);
  }
`;

export const NavbarIcon: React.FC<IconProps> = ({ iconName }) => (
  <StyledNavbarIcon>
    <Icon iconName={iconName} iconSize="2" variant="white" />
  </StyledNavbarIcon>
);

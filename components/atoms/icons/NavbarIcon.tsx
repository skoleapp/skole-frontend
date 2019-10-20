import React from 'react';
import { IconProps } from '../../../interfaces';
import { Icon } from './Icon';

export const NavbarIcon: React.FC<IconProps> = props => (
  <Icon size={3} hoverVariant="white" {...props} />
);

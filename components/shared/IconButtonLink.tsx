import { IconButton } from '@material-ui/core';
import { IconButtonProps } from '@material-ui/core/IconButton';
import { SvgIconComponent } from '@material-ui/icons';
import { LinkProps } from 'next/link';
import { Link } from '../../i18n';

import React from 'react';

interface Props extends IconButtonProps, LinkProps {
  icon: SvgIconComponent;
}

export const IconButtonLink: React.FC<Props> = ({ href, icon: Icon, children, ...props }) => (
  <Link href={href}>
    <IconButton {...props}>
      <Icon />
    </IconButton>
  </Link>
);

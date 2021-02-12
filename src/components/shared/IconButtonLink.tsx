import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import { LinkProps } from 'next/link';
import React, { forwardRef } from 'react';

import { Link } from './Link';

type SvgIconComponent = typeof SvgIcon;

interface Props extends IconButtonProps, LinkProps {
  icon: SvgIconComponent;
}

export const IconButtonLink = forwardRef<HTMLButtonElement, Props>(
  ({ href, icon: Icon, ...props }, ref) => (
    <Link href={href}>
      <IconButton {...props} ref={ref}>
        <Icon />
      </IconButton>
    </Link>
  ),
);

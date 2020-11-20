import { IconButton } from '@material-ui/core';
import { IconButtonProps } from '@material-ui/core/IconButton';
import { SvgIconComponent } from '@material-ui/icons';
import Link, { LinkProps } from 'next/link';
import React, { forwardRef } from 'react';

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

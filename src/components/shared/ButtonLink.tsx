import Button, { ButtonProps } from '@material-ui/core/Button';
import { useTheme } from '@material-ui/core/styles';
import { LinkProps } from 'next/link';
import React from 'react';

import { Link } from './Link';

interface Props extends LinkProps, Omit<ButtonProps, 'href'> {
  fullWidth?: boolean;
}

export const ButtonLink: React.FC<Props> = ({
  href,
  children,
  fullWidth: _fullWidth,
  ...buttonProps
}) => {
  const { props } = useTheme();

  // Ignore: The default button props cannot be destructured from the default MUI props.
  const fullWidth = _fullWidth !== undefined ? _fullWidth : props?.MuiButton?.fullWidth; // eslint-disable-line react/destructuring-assignment

  return (
    <Link href={href} fullWidth={fullWidth}>
      <Button {...buttonProps} fullWidth={fullWidth}>
        {children}
      </Button>
    </Link>
  );
};

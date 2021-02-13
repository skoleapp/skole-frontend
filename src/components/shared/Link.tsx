import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import NextLink, { LinkProps } from 'next/link';
import React from 'react';

const useStyles = makeStyles(() => ({
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  fullWidth: {
    width: '100%',
  },
}));

interface Props extends LinkProps {
  fullWidth?: boolean;
}

export const Link: React.FC<Props> = ({ href, children, fullWidth, ...props }) => {
  const classes = useStyles();

  return (
    <NextLink href={href} {...props} passHref>
      <a // eslint-disable-line jsx-a11y/anchor-is-valid
        // Ignore: the `passHref` automatically passes the href to the anchor tag.
        className={clsx(classes.link, fullWidth && classes.fullWidth)}
      >
        {children}
      </a>
    </NextLink>
  );
};

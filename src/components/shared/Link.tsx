import { makeStyles } from '@material-ui/core/styles';
import NextLink, { LinkProps } from 'next/link';
import React from 'react';

type Props = LinkProps;

const useStyles = makeStyles(() => ({
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
}));

export const Link: React.FC<Props> = ({ href, children, ...props }) => {
  const classes = useStyles();
  return (
    <NextLink href={href} {...props}>
      <a className={classes.link} href={String(href)}>
        {children}
      </a>
    </NextLink>
  );
};

import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
  root: {
    textDecoration: 'none',
    color: 'inherit',
  },
});

interface Props {
  href: string;
}

export const ExternalLink: React.FC<Props> = ({ href, children }) => {
  const classes = useStyles();

  return (
    <a href={href} target="_blank" rel="noreferrer" className={classes.root}>
      {children}
    </a>
  );
};

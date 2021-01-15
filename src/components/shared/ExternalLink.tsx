import { makeStyles } from '@material-ui/core/styles';
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

// A wrapper for any element that is used as a link.
// A normal anchor tag with all styles removed.
export const ExternalLink: React.FC<Props> = ({ href, children }) => {
  const classes = useStyles();

  return (
    <a href={href} target="_blank" rel="noreferrer" className={classes.root}>
      {children}
    </a>
  );
};

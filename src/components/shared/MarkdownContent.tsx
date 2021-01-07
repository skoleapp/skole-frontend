import { makeStyles } from '@material-ui/core';
import React from 'react';
import ReactMarkdown from 'react-markdown';

const useStyles = makeStyles(({ palette }) => ({
  markdown: {
    '& a': {
      color: palette.primary.main,
    },
  },
}));

interface Props {
  children: string;
}

export const MarkdownContent: React.FC<Props> = ({ children }) => {
  const classes = useStyles();
  return <ReactMarkdown className={classes.markdown}>{children}</ReactMarkdown>;
};

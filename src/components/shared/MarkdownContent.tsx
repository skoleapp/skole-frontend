import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import ReactMarkdown from 'react-markdown';

const useStyles = makeStyles(({ palette }) => ({
  markdown: {
    '& p': {
      margin: 0,
    },
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

import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import ReactMarkdown from 'react-markdown';

const useStyles = makeStyles(({ palette, spacing }) => ({
  markdown: {
    '& a': {
      color: palette.primary.main,
    },
    '& p': {
      marginTop: spacing(2),
      marginBottom: spacing(2),
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

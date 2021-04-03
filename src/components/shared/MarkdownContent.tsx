import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    textAlign: 'left',
    '& a': {
      color: palette.type === 'dark' ? palette.secondary.main : palette.primary.main,
    },
    '& p': {
      marginTop: spacing(2),
      marginBottom: spacing(2),
    },
    '& ul': {
      paddingLeft: spacing(6),
    },
    '& *': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
  dense: {
    '& *': {
      margin: '0 !important',
    },
  },
}));

interface Props {
  children: string;
  dense?: boolean;
}

export const MarkdownContent: React.FC<Props> = ({ children, dense }) => {
  const classes = useStyles();

  return (
    <ReactMarkdown
      className={clsx(classes.root, dense && classes.dense)}
      plugins={[gfm]}
      disallowedTypes={['image']} // Do not render images.
      linkTarget="_blank" // Open all links externally.
    >
      {children}
    </ReactMarkdown>
  );
};

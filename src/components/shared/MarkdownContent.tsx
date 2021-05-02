import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    textAlign: 'left',
    wordBreak: 'break-word',
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
    '& blockquote': {
      borderLeft: `0.25rem solid ${palette.grey[300]}`,
      paddingLeft: spacing(2),
      marginLeft: 0,
    },
    '& ol': {
      paddingLeft: spacing(6),
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
      disallowedElements={['img']} // Do not render images.
      linkTarget="_blank" // Open all links externally.
    >
      {children}
    </ReactMarkdown>
  );
};

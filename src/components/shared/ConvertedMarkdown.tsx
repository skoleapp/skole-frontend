import { Box, makeStyles } from '@material-ui/core';
import React from 'react';

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

export const ConvertedMarkdown: React.FC<Props> = ({ children }) => {
  const classes = useStyles();
  return <Box className={classes.markdown} dangerouslySetInnerHTML={{ __html: children }} />;
};

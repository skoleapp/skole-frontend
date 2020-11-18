import { Box, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(/images/background.jpg)',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
});

export const MainBackground: React.FC = () => {
  const classes = useStyles();
  return <Box className={classes.root} />;
};

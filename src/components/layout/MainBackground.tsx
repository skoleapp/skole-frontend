import { Box, makeStyles } from '@material-ui/core';
import React from 'react';
import Image from 'next/image';

const useStyles = makeStyles({
  colorLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
});

export const MainBackground: React.FC = () => {
  const classes = useStyles();

  return (
    <>
      <Image layout="fill" src="/images/background.jpg" />
      <Box className={classes.colorLayer} />
    </>
  );
};

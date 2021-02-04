import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'lib';
import Image from 'next/image';
import React from 'react';

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    height: '100vh',
    width: '100vw',
    zIndex: 0,
  },
});

export const MainBackground: React.FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Image
        src="/images/background.jpg"
        layout="fill"
        objectFit="cover"
        alt={t('common:mainBackgroundAlt')}
      />
    </Box>
  );
};

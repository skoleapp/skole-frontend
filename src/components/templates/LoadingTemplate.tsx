import { Box, makeStyles } from '@material-ui/core';
import Image from 'next/image';
import React from 'react';

import { MainTemplate } from './MainTemplate';

const useStyles = makeStyles(({ palette }) => ({
  root: {
    flexGrow: 1,
    backgroundColor: palette.secondary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bounce: {
    animation: '$bounce 1s',
    animationIterationCount: 'infinite',
  },
  '@keyframes bounce': {
    '0%, 25%, 50%, 75%, 100%': {
      transform: 'translateY(0)',
    },
    '40%': {
      transform: 'translateY(-20px)',
    },
    '60%': {
      transform: 'translateY(-12px)',
    },
  },
}));

export const LoadingTemplate: React.FC = () => {
  const classes = useStyles();

  const layoutProps = {
    seoProps: {
      title: '',
      description: '',
    },
    disableBottomNavbar: true,
    disableFooter: true,
    topNavbarProps: {
      disableLogo: true,
      disableSearch: true,
      disableAuthButtons: true,
      disableForEducatorsButton: true,
      disableLanguageButton: true,
    },
    containerProps: {
      fullWidth: true,
      dense: true,
    },
  };

  return (
    <MainTemplate {...layoutProps}>
      <Box className={classes.root}>
        <Image
          height={120}
          width={150}
          className={classes.bounce}
          src="/images/icons/skole-icon-text-red.svg"
        />
      </Box>
    </MainTemplate>
  );
};

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { useDarkModeContext } from 'context';
import Image from 'next/image';
import React from 'react';
import { SeoPageProps } from 'types';

import { MainTemplate } from './MainTemplate';

const useStyles = makeStyles(({ palette }) => ({
  root: {
    flexGrow: 1,
    backgroundColor: palette.type === 'dark' ? palette.background.default : palette.secondary.main,
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

export const LoadingTemplate: React.FC<SeoPageProps> = ({ seoProps }) => {
  const classes = useStyles();
  const { darkMode } = useDarkModeContext();

  const src = darkMode
    ? '/images/icons/skole-icon-text.svg'
    : '/images/icons/skole-icon-text-red.svg';

  const layoutProps = {
    seoProps,
    hideBottomNavbar: true,
    hideFooter: true,
    topNavbarProps: {
      hideBackButton: true,
      hideLogo: true,
      hideNavigation: true,
      hideSearch: true,
      hideDynamicButtons: true,
      hideLanguageButton: true,
      hideDarkModeButton: true,
    },
    containerProps: {
      fullWidth: true,
      dense: true,
    },
  };

  return (
    <MainTemplate {...layoutProps}>
      <Box className={classes.root}>
        <Image height={120} width={150} className={classes.bounce} src={src} />
      </Box>
    </MainTemplate>
  );
};

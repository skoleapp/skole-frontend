import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'lib';
import React from 'react';
import Image from 'next/image';
import { MainTemplateProps } from 'types';
import { MainTemplate } from './MainTemplate';
import { MainBackground } from '../layout';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  headerContainer: {
    position: 'relative',
    textAlign: 'center',
    padding: `${spacing(8)} ${spacing(2)}`,
    [breakpoints.up('md')]: {
      marginTop: spacing(16),
    },
  },
  logo: {
    height: '4rem',
    position: 'relative',
    [breakpoints.up('sm')]: {
      height: '5rem',
    },
    [breakpoints.up('md')]: {
      height: '6rem',
    },
  },
  slogan: {
    fontSize: '1.5rem',
    marginTop: spacing(4),
  },
  children: {
    position: 'relative',
    flexGrow: 1,
  },
}));

interface Props extends MainTemplateProps {
  disableHeader?: boolean;
}

export const LandingPageTemplate: React.FC<Props> = ({
  children,
  topNavbarProps,
  disableHeader,
  ...props
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const renderBackground = <MainBackground />;

  const renderLogo = (
    <Box className={classes.logo}>
      <Image layout="fill" src="/images/icons/skole-icon-text.svg" />
    </Box>
  );

  const renderSlogan = (
    <Typography className={classes.slogan} variant="h1" color="secondary" gutterBottom>
      {t('marketing:slogan')}
    </Typography>
  );

  const renderHeader = !disableHeader && (
    <Box className={classes.headerContainer}>
      {renderLogo}
      {renderSlogan}
    </Box>
  );

  const renderChildren = (
    <Grid className={classes.children} container direction="column">
      {children}
    </Grid>
  );

  const layoutProps = {
    topNavbarProps: {
      ...topNavbarProps,
      hideSearch: true,
    },
    hideBottomNavbar: true,
    containerProps: {
      fullWidth: true,
      dense: true,
    },
    ...props,
  };

  return (
    <MainTemplate {...layoutProps}>
      <Box className={classes.container}>
        {renderBackground}
        {renderHeader}
        {renderChildren}
      </Box>
    </MainTemplate>
  );
};

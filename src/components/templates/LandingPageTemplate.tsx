import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import { useDarkModeContext } from 'context';
import { useTranslation } from 'lib';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { MainTemplateProps } from 'types';
import { SCHOOL_LOGOS, SLOGAN, urls } from 'utils';

import { AppStoreBadge, ButtonLink, Emoji, GooglePlayBadge } from '../shared';
import { MainTemplate } from './MainTemplate';

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
  container: {
    flexGrow: 1,
    padding: spacing(2),
  },
  logoContainer: {
    position: 'relative',
    textAlign: 'center',
    padding: `${spacing(8)} ${spacing(2)}`,
    [breakpoints.up('md')]: {
      marginTop: spacing(8),
    },
  },
  logo: {
    width: '10rem',
    height: '3rem',
    position: 'relative',
    [breakpoints.up('sm')]: {
      width: '12rem',
      height: '5rem',
    },
    [breakpoints.up('md')]: {
      width: '14rem',
      height: '6rem',
    },
  },
  slogan: {
    fontSize: '1.25rem',
  },
  info: {
    marginTop: spacing(6),
    fontSize: '1rem',
  },
  ctaButton: {
    minWidth: '10rem',
    padding: spacing(3),
    marginTop: spacing(8),
  },
  or: {
    marginTop: spacing(4),
    fontSize: '0.75rem',
  },
  authLink: {
    marginTop: spacing(4),
  },
  appStoreBadgeContainer: {
    padding: `${spacing(8)} ${spacing(2)}`,
  },
  appStoreBadgeImageContainer: {
    maxWidth: '25rem',
  },
  schools: {
    backgroundColor: palette.grey[300],
    padding: `${spacing(4)} 0`,
  },
}));

interface Props extends MainTemplateProps {
  hideLogoAndSlogan?: boolean;
}

export const LandingPageTemplate: React.FC<Props> = ({
  children,
  topNavbarProps,
  containerProps,
  footerProps,
  hideLogoAndSlogan,
  ...props
}) => {
  const classes = useStyles();
  const { darkMode } = useDarkModeContext();
  const { t } = useTranslation();
  const { query } = useRouter();
  const infoText = t('common:landingPageInfo');

  const renderInfoTextEmoji = useMemo(() => <Emoji emoji="👇" />, []);

  const renderHeader = useMemo(
    () =>
      !hideLogoAndSlogan && (
        <Box className={classes.logoContainer}>
          <Box className={classes.logo}>
            <Image
              layout="fill"
              src={`/images/icons/skole-icon-text${!darkMode ? '-red' : ''}.svg`}
            />
          </Box>
        </Box>
      ),
    [classes.logo, classes.logoContainer, darkMode, hideLogoAndSlogan],
  );

  const renderSlogan = useMemo(
    () =>
      !hideLogoAndSlogan && (
        <Typography
          className={classes.slogan}
          variant="subtitle1"
          color={darkMode ? 'secondary' : 'initial'}
          align="center"
          gutterBottom
        >
          {SLOGAN}
        </Typography>
      ),
    [classes.slogan, darkMode, hideLogoAndSlogan],
  );

  const renderInfo = useMemo(
    () => (
      <Grid item xs={12} md={3}>
        <Typography className={classes.info} variant="body2" align="center" color="textSecondary">
          {infoText}
          {renderInfoTextEmoji}
        </Typography>
      </Grid>
    ),
    [classes.info, infoText, renderInfoTextEmoji],
  );

  const renderCta = useMemo(
    () => (
      <ButtonLink
        className={classes.ctaButton}
        href={{ pathname: urls.register, query: query.code && { code: query.code } }}
        color="primary"
        variant="contained"
        endIcon={<ArrowForwardOutlined />}
      >
        {t('common:landingPageCta')}
      </ButtonLink>
    ),
    [classes.ctaButton, t, query],
  );

  const renderAppStoreBadges = useMemo(
    () => (
      <Grid
        className={classes.appStoreBadgeContainer}
        container
        justify="center"
        alignItems="center"
      >
        <Grid
          className={classes.appStoreBadgeImageContainer}
          container
          justify="center"
          spacing={4}
        >
          <Grid item xs={6}>
            <AppStoreBadge />
          </Grid>
          <Grid item xs={6}>
            <GooglePlayBadge />
          </Grid>
        </Grid>
      </Grid>
    ),
    [classes.appStoreBadgeContainer, classes.appStoreBadgeImageContainer],
  );

  const renderMainContent = useMemo(
    () => (
      <Grid
        className={classes.container}
        container
        direction="column"
        justify={hideLogoAndSlogan ? 'flex-start' : 'center'}
        alignItems="center"
      >
        {renderHeader}
        {renderSlogan}
        {renderInfo}
        {renderCta}
        {renderAppStoreBadges}
      </Grid>
    ),
    [
      classes.container,
      hideLogoAndSlogan,
      renderAppStoreBadges,
      renderCta,
      renderSlogan,
      renderHeader,
      renderInfo,
    ],
  );

  const renderSchoolLogos = useMemo(
    () =>
      SCHOOL_LOGOS.map(({ name, alt }) => (
        <Grid item>
          <Image
            width={100}
            height={100}
            layout="intrinsic"
            objectFit="contain"
            src={`/images/school-logos/${name}`}
            alt={alt}
          />
        </Grid>
      )),
    [],
  );

  const renderSchoolsBanner = useMemo(
    () => (
      <Grid className={classes.schools} container justify="center">
        <Container disableGutters>
          <Grid item container spacing={8} justify="center" alignItems="center">
            {renderSchoolLogos}
          </Grid>
        </Container>
      </Grid>
    ),
    [classes.schools, renderSchoolLogos],
  );

  const layoutProps = {
    topNavbarProps: {
      hideBackButton: true,
      hideSearch: true,
      hideGetStartedButton: true,
      ...topNavbarProps,
    },
    containerProps: {
      fullWidth: true,
      dense: true,
      ...containerProps,
    },
    footerProps: {
      hideAppStoreBadges: true,
      ...footerProps,
    },
    hideBottomNavbar: true,
    ...props,
  };

  return (
    <MainTemplate {...layoutProps}>
      {children}
      {renderMainContent}
      {renderSchoolsBanner}
    </MainTemplate>
  );
};

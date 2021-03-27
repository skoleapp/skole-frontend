import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import {
  AppStoreBadge,
  ButtonLink,
  Emoji,
  GooglePlayBadge,
  LandingPageTemplate,
  LoadingTemplate,
} from 'components';
import { useAuthContext, useDarkModeContext } from 'context';
import { withUserMe } from 'hocs';
import { useMediaQueries } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import Router from 'next/router';
import React, { useEffect } from 'react';
import { SeoPageProps } from 'types';
import { SCHOOL_LOGOS, urls } from 'utils';

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
  description: {
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

const LandingPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { userMe } = useAuthContext();
  const { isMobile } = useMediaQueries();
  const { darkMode } = useDarkModeContext();
  const headerText = 'Next-gen study forum.';
  const infoText = t('index:infoText');

  // Redirect authenticated users to home page.
  useEffect(() => {
    if (userMe) {
      Router.replace(urls.home);
    }
  }, [userMe]);

  const renderHeaderEmoji = <Emoji emoji="🎓" />;
  const renderInfoTextEmoji = <Emoji emoji="👇" />;

  const renderHeader = (
    <Box className={classes.logoContainer}>
      <Box className={classes.logo}>
        <Image layout="fill" src={`/images/icons/skole-icon-text${!darkMode ? '-red' : ''}.svg`} />
      </Box>
    </Box>
  );

  const renderDescription = (
    <Typography
      className={classes.description}
      variant="subtitle1"
      color={darkMode ? 'secondary' : 'initial'}
      align="center"
      gutterBottom
    >
      {headerText}
      {renderHeaderEmoji}
    </Typography>
  );

  const renderInfo = (
    <Grid item xs={12} md={3}>
      <Typography className={classes.info} variant="body2" align="center" color="textSecondary">
        {infoText}
        {renderInfoTextEmoji}
      </Typography>
    </Grid>
  );

  const renderCta = (
    <ButtonLink
      className={classes.ctaButton}
      href={urls.register}
      color="primary"
      variant="contained"
      endIcon={<ArrowForwardOutlined />}
    >
      {t('index:cta')}
    </ButtonLink>
  );

  const renderAppStoreBadges = (
    <Grid className={classes.appStoreBadgeContainer} container justify="center" alignItems="center">
      <Grid className={classes.appStoreBadgeImageContainer} container justify="center" spacing={4}>
        <Grid item xs={6}>
          <AppStoreBadge />
        </Grid>
        <Grid item xs={6}>
          <GooglePlayBadge />
        </Grid>
      </Grid>
    </Grid>
  );

  const renderSchoolLogos = SCHOOL_LOGOS.map(({ name, alt }) => (
    <Grid item>
      <Image
        width={125}
        height={125}
        layout="intrinsic"
        objectFit="contain"
        src={`/images/school-logos/${name}`}
        alt={alt}
      />
    </Grid>
  ));

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      hideBackButton: true,
      hideLogo: isMobile,
      hideGetStartedButton: true,
    },
    footerProps: {
      hideAppStoreBadges: true,
    },
  };

  // Show loading screen when redirecting to home page.
  if (userMe) {
    return <LoadingTemplate seoProps={seoProps} />;
  }

  return (
    <LandingPageTemplate {...layoutProps}>
      <Grid
        className={classes.container}
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        {renderHeader}
        {renderDescription}
        {renderInfo}
        {renderCta}
        {renderAppStoreBadges}
      </Grid>
      <Grid className={classes.schools} container justify="center">
        <Grid item container xs={12} lg={9} xl={6} spacing={8} justify="center" alignItems="center">
          {renderSchoolLogos}
        </Grid>
      </Grid>
    </LandingPageTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const t = await getT(locale, 'index');

  return {
    props: {
      _ns: await loadNamespaces(['index'], locale),
      seoProps: {
        title: t('title'),
        description: t('description'),
      },
    },
  };
};

export default withUserMe(LandingPage);

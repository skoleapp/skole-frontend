import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import clsx from 'clsx';
import { ButtonLink, LandingPageTemplate, LoadingTemplate, TextLink } from 'components';
import { useAuthContext } from 'context';
import { withUserMe } from 'hocs';
import { useMediaQueries } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import Router from 'next/router';
import React, { useEffect } from 'react';
import { LANDING_PAGE_PITCH_ITEMS, NATIVE_APP_USER_AGENT, urls } from 'utils';

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
  ctaContainer: {
    padding: `${spacing(8)} ${spacing(2)}`,
    paddingTop: 0,
    flexGrow: 1,
    fontWeight: 'bold',
  },
  ctaHeader: {
    marginTop: spacing(8),
    fontSize: '1.25rem',
    [breakpoints.up('md')]: {
      fontSize: '1.5rem',
    },
  },
  ctaButton: {
    minWidth: '10rem',
    padding: spacing(3),
    marginTop: spacing(8),
  },
  or: {
    marginTop: spacing(4),
  },
  authLink: {
    marginTop: spacing(4),
  },
  pitchContainer: {
    overflow: 'hidden',
  },
  pitchBoxContainer: {
    backgroundColor: palette.grey[300],
    padding: `${spacing(4)} ${spacing(2)}`,
    textAlign: 'left',
    [breakpoints.up('md')]: {
      padding: spacing(6),
    },
  },
  nativeAppPitchBoxContainer: {
    paddingBottom: `calc(${spacing(4)} + env(safe-area-inset-bottom))`,
    [breakpoints.up('md')]: {
      paddingBottom: `calc(${spacing(6)} + env(safe-area-inset-bottom))`,
    },
  },
  pitchHeader: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  pitchHeaderDivider: {
    height: '0.25rem',
    backgroundColor: palette.primary.main,
    marginBottom: spacing(2),
    borderRadius: '0.5rem',
  },
  badgeContainer: {
    backgroundColor: palette.grey[300],
    padding: spacing(4),
    paddingBottom: `calc(${spacing(4)} + env(safe-area-inset-bottom))`,
    [breakpoints.up('md')]: {
      padding: spacing(8),
      paddingBottom: `calc(${spacing(8)} + env(safe-area-inset-bottom))`,
    },
  },
  badgeCard: {
    flexGrow: 1,
    backgroundColor: palette.grey[200],
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'none',
    border: `0.15rem solid ${palette.grey[400]}`,
    borderRadius: '1rem',
  },
  badgeCardContent: {
    flexGrow: 1,
    padding: '0 !important',
    paddingTop: `${spacing(4)} !important`,
  },
  badgeCardText: {
    fontSize: '1.1rem',
  },
  badge: {
    width: '10rem',
    height: '4rem',
    margin: spacing(2),
    position: 'relative',
    opacity: 0.5, // TODO: Remove this when the actual links are available.
  },
}));

interface Props extends Record<string, unknown> {
  nativeApp: boolean;
}

const LandingPage: NextPage<Props> = ({ nativeApp }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { userMe } = useAuthContext();
  const { isMobile } = useMediaQueries();

  // Redirect authenticated users to home page.
  useEffect(() => {
    !!userMe && Router.replace(urls.home);
  }, [userMe]);

  const ctaUrl = {
    pathname: urls.register,
    query: {
      ref: 'get-started',
    },
  };

  const renderCtaHeader = (
    <Typography className={classes.ctaHeader} variant="subtitle1" color="secondary" align="center">
      {t('marketing:description')}
    </Typography>
  );

  const renderCtaButton = (
    <ButtonLink
      className={classes.ctaButton}
      href={ctaUrl}
      color="primary"
      variant="contained"
      endIcon={<ArrowForwardOutlined />}
    >
      {t('index:cta')}
    </ButtonLink>
  );

  const renderOr = (
    <Typography className={classes.or} variant="body2" color="secondary">
      {t('index:or').toUpperCase()}
    </Typography>
  );

  const renderAuthLink = (
    <Typography className={classes.authLink}>
      <TextLink href={urls.home} color="secondary">
        {t('index:skipLogin')}
      </TextLink>
    </Typography>
  );

  const renderCta = (
    <Grid
      className={classes.ctaContainer}
      container
      direction="column"
      alignItems="center"
      justify="center"
    >
      {renderCtaHeader}
      {renderCtaButton}
      {renderOr}
      {renderAuthLink}
    </Grid>
  );

  const renderPitchItems = LANDING_PAGE_PITCH_ITEMS.map(({ header, bullets }) => (
    <Grid item xs={12} md={6}>
      <Typography className={classes.pitchHeader} variant="subtitle1">
        {t(header).toUpperCase()}
      </Typography>
      <Divider className={classes.pitchHeaderDivider} />
      {bullets.map((b) => (
        <Typography variant="body2" color="textSecondary">
          - {t(b)}
        </Typography>
      ))}
    </Grid>
  ));

  const renderPitch = (
    <Grid container direction="column" alignItems="center" className={classes.pitchContainer}>
      <Grid
        container
        item
        xs={12}
        lg={8}
        xl={6}
        className={clsx(classes.pitchBoxContainer, nativeApp && classes.nativeAppPitchBoxContainer)}
        spacing={8}
      >
        {renderPitchItems}
      </Grid>
    </Grid>
  );

  const renderBadgeCardContent = (
    <CardContent className={classes.badgeCardContent}>
      <Typography
        className={classes.badgeCardText}
        variant="subtitle1"
        color="textSecondary"
        align="center"
      >
        {t('index:appStoreCta')} 📱
      </Typography>
    </CardContent>
  );

  const renderBadgeCardActions = (
    <CardActions>
      <Grid container justify="center">
        <Box className={classes.badge}>
          <Image layout="fill" src="/images/app-store-badges/apple-app-store-badge.svg" />
        </Box>
        <Box className={classes.badge}>
          <Image layout="fill" src="/images/app-store-badges/google-play-badge.svg" />
        </Box>
      </Grid>
    </CardActions>
  );

  const renderBadges = !nativeApp && (
    <Grid container justify="center" className={classes.badgeContainer}>
      <Grid item xs={12} md={6} lg={4} xl={3}>
        <Card className={classes.badgeCard}>
          {renderBadgeCardContent}
          {renderBadgeCardActions}
        </Card>
      </Grid>
    </Grid>
  );

  const layoutProps = {
    seoProps: {
      title: t('index:title'),
      description: t('marketing:description'),
    },
    hideBottomNavbar: true,
    topNavbarProps: {
      hideLogo: isMobile,
      hideAuthButtons: true,
    },
  };

  // Show loading screen when redirecting to home page.
  if (userMe) {
    return <LoadingTemplate />;
  }

  return (
    <LandingPageTemplate {...layoutProps}>
      {renderCta}
      {renderPitch}
      {renderBadges}
    </LandingPageTemplate>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req: { headers }, locale }) => ({
  props: {
    _ns: await loadNamespaces(['index'], locale),
    nativeApp: headers['user-agent'] === NATIVE_APP_USER_AGENT,
  },
});

export default withUserMe(LandingPage);

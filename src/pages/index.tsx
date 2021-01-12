import {
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { ButtonLink, LandingPageTemplate, LoadingTemplate, TextLink } from 'components';
import { useAuthContext } from 'context';
import { withUserMe } from 'hocs';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import { NextPage } from 'next';
import Image from 'next/image';
import Router, { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { LANDING_PAGE_PITCH_ITEMS, urls } from 'utils';

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
    [breakpoints.up('md')]: {
      padding: spacing(8),
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

const LandingPage: NextPage = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { query } = useRouter();
  const { userMe } = useAuthContext();
  const { isMobile } = useMediaQueries();

  // Redirect authenticated users to home page.
  useEffect(() => {
    !!userMe && Router.push(urls.home);
  }, [userMe]);

  const ctaUrl = {
    pathname: urls.register,
    query,
  };

  const skipLoginUrl = {
    pathname: query.next ? String(query.next) : urls.home,
    query,
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
      <TextLink href={skipLoginUrl} color="secondary">
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
      <Grid container item xs={12} lg={8} xl={6} className={classes.pitchBoxContainer} spacing={8}>
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

  const renderBadges = (
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

export default withUserMe(LandingPage);

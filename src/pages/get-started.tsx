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
import { ButtonLink, LanguageButton, MainBackground, MainTemplate, TextLink } from 'components';
import { withNoAuth } from 'hocs';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { GET_STARTED_PAGE_VISITED_KEY, PITCH_ITEMS, urls } from 'utils';

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
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
  ctaContainer: {
    position: 'relative',
    padding: `${spacing(8)} ${spacing(2)}`,
    paddingTop: 0,
    flexGrow: 1,
    fontWeight: 'bold',
  },
  description: {
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
    position: 'relative',
    overflow: 'hidden',
  },
  pitchBoxContainer: {
    backgroundColor: palette.grey[300],
    padding: `${spacing(4)} ${spacing(2)}`,
    textAlign: 'left',
  },
  pitchHeader: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: spacing(2),
  },
  pitchHeaderDivider: {
    height: '0.25rem',
    backgroundColor: palette.primary.main,
    marginBottom: spacing(2),
    borderRadius: '0.5rem',
    maxWidth: '10rem',
  },
  badgeContainer: {
    position: 'relative',
    backgroundColor: palette.grey[300],
    padding: `${spacing(8)} ${spacing(2)}`,
  },
  badgeCard: {
    height: '100%',
    backgroundColor: palette.grey[200],
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'none',
    border: `0.15rem solid ${palette.grey[400]}`,
    borderRadius: '1rem',
  },
  badgeCardContent: {
    flexGrow: 1,
    padding: spacing(2),
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

const GetStartedPage: NextPage = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { query } = useRouter();

  const ctaUrl = {
    pathname: urls.register,
    query,
  };

  const skipLoginUrl = {
    pathname: query.next ? String(query.next) : urls.home,
    query,
  };

  useEffect(() => {
    localStorage.setItem(GET_STARTED_PAGE_VISITED_KEY, new Date().toString());
  }, []);

  const renderBackground = <MainBackground />;
  const renderLanguageButton = <LanguageButton />;

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

  const renderHeader = (
    <Box className={classes.headerContainer}>
      {renderLogo}
      {renderSlogan}
    </Box>
  );

  const renderDescription = (
    <Typography
      className={classes.description}
      variant="subtitle1"
      color="secondary"
      align="center"
    >
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
      {t('get-started:cta')}
    </ButtonLink>
  );

  const renderOr = (
    <Typography className={classes.or} variant="body2" color="secondary">
      {t('get-started:or').toUpperCase()}
    </Typography>
  );

  const renderAuthLink = (
    <Typography className={classes.authLink}>
      <TextLink href={skipLoginUrl} color="secondary">
        {t('get-started:skipLogin')}
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
      {renderDescription}
      {renderCtaButton}
      {renderOr}
      {renderAuthLink}
    </Grid>
  );

  const renderPitchItems = PITCH_ITEMS.map(({ header, text }) => (
    <Grid item xs={12} md={6}>
      <Typography className={classes.pitchHeader} variant="subtitle1">
        {t(header)}
      </Typography>
      <Divider className={classes.pitchHeaderDivider} />
      <Typography variant="body2" color="textSecondary">
        {t(text)}
      </Typography>
    </Grid>
  ));

  const renderPitch = (
    <Grid container direction="column" alignItems="center" className={classes.pitchContainer}>
      <Grid container item xs={12} lg={8} xl={6} className={classes.pitchBoxContainer} spacing={4}>
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
        {t('get-started:appStoreCta')}
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
      <Card className={classes.badgeCard}>
        {renderBadgeCardContent}
        {renderBadgeCardActions}
      </Card>
    </Grid>
  );

  const layoutProps = {
    seoProps: {
      title: t('get-started:title'),
      description: t('marketing:description'),
    },
    disableBottomNavbar: true,
    topNavbarProps: {
      headerRight: renderLanguageButton,
      disableLogo: true,
      disableSearch: true,
    },
    containerProps: {
      fullWidth: true,
      dense: true,
    },
  };

  return (
    <MainTemplate {...layoutProps}>
      <Box className={classes.container}>
        {renderBackground}
        {renderHeader}
        {renderCta}
        {renderPitch}
        {renderBadges}
      </Box>
    </MainTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['get-started'], locale),
  },
});

export default withNoAuth(GetStartedPage);

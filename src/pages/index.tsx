import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import clsx from 'clsx';
import { ButtonLink, Emoji, LandingPageTemplate, LoadingTemplate, TextLink } from 'components';
import { useAuthContext } from 'context';
import { withUserMe } from 'hocs';
import { useMediaQueries } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router from 'next/router';
import React, { useEffect } from 'react';
import { SeoPageProps } from 'types';
import { isNotNativeApp, urls } from 'utils';

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
  ctaContainer: {
    flexGrow: 1,
    padding: `${spacing(8)} ${spacing(2)}`,
  },
  ctaHeader: {
    fontSize: '1.5rem',
    [breakpoints.up('sm')]: {
      fontSize: '2rem',
    },
    [breakpoints.up('md')]: {
      fontSize: '2.25rem',
    },
    [breakpoints.up('lg')]: {
      fontSize: '2.75rem',
    },
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
  pitchContainer: {
    overflow: 'hidden',
  },
  pitchBoxContainer: {
    backgroundColor: palette.type === 'dark' ? palette.background.default : palette.grey[300],
    padding: `${spacing(4)} ${spacing(2)}`,
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
}));

const LandingPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { userMe } = useAuthContext();
  const { isMobile } = useMediaQueries();
  const headerText = t('common:description');

  // Redirect authenticated users to home page.
  useEffect(() => {
    !!userMe && Router.replace(urls.home);
  }, [userMe]);

  const handleSkipLogin = () => sa_event('click_skip_login');

  const renderHeaderEmoji = <Emoji emoji="🎓" />;

  const renderCtaHeader = (
    <Typography
      className={classes.ctaHeader}
      variant="subtitle1"
      color="secondary"
      align="center"
      gutterBottom
    >
      {headerText}
      {renderHeaderEmoji}
    </Typography>
  );

  const renderCtaSubheader = (
    <Grid item xs={12} sm={10} md={8} lg={4}>
      <Typography variant="subtitle1" color="secondary" align="center">
        {t('index:ctaSubheader1')}
        <strong>{t('index:ctaSubheader2')}</strong>
        {t('index:ctaSubheader3')}
        <strong> {t('index:ctaSubheader4')}</strong>
        {t('index:ctaSubheader5')}
      </Typography>
    </Grid>
  );

  const renderCtaButton = (
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

  const renderOr = (
    <Typography className={classes.or} variant="body2" color="secondary">
      {t('index:or').toUpperCase()}
    </Typography>
  );

  const renderAuthLink = (
    <Typography className={classes.authLink}>
      <TextLink onClick={handleSkipLogin} href={urls.home} color="secondary">
        {t('index:skipLogin')}
      </TextLink>
    </Typography>
  );

  const renderCta = (
    <Grid
      className={classes.ctaContainer}
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      {renderCtaHeader}
      {renderCtaSubheader}
      {renderCtaButton}
      {renderOr}
      {renderAuthLink}
    </Grid>
  );

  const materialsPitchHeader = t('index:materialsPitchHeader').toUpperCase();
  const discussionPitchHeader = t('index:discussionPitchHeader').toUpperCase();

  const renderMaterialsEmoji = <Emoji emoji="📚" />;
  const renderGrinningEmoji = <Emoji emoji="😁" />;
  const renderDiscussionEmoji = <Emoji emoji="💬" />;
  const renderNerdEmoji = <Emoji emoji="🤓" />;

  const materialBullets = {
    1: t('index:materialsBullet1'),
    2: t('index:materialsBullet2'),
    3: t('index:materialsBullet3'),
    4: t('index:materialsBullet4'),
  };

  const discussionBullets = {
    1: t('index:discussionBullet1'),
    2: t('index:discussionBullet2'),
    3: t('index:discussionBullet3'),
    4: t('index:discussionBullet4'),
  };

  const renderPitchItems = (
    <>
      <Grid item xs={12} md={6}>
        <Typography className={classes.pitchHeader} variant="subtitle1">
          {materialsPitchHeader}
          {renderMaterialsEmoji}
        </Typography>
        <Divider className={classes.pitchHeaderDivider} />
        <Typography variant="body2" color="textSecondary">
          {materialBullets[1]}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {materialBullets[2]}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {materialBullets[3]}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {materialBullets[4]}
          {renderGrinningEmoji}
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography className={classes.pitchHeader} variant="subtitle1">
          {discussionPitchHeader}
          {renderDiscussionEmoji}
        </Typography>
        <Divider className={classes.pitchHeaderDivider} />
        <Typography variant="body2" color="textSecondary">
          {discussionBullets[1]}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {discussionBullets[2]}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {discussionBullets[3]}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {discussionBullets[4]}
          {renderNerdEmoji}
        </Typography>
      </Grid>
    </>
  );

  const renderPitch = (
    <Grid container justify="center" className={classes.pitchContainer}>
      <Grid
        container
        item
        xs={12}
        lg={8}
        xl={6}
        className={clsx(
          classes.pitchBoxContainer,
          isNotNativeApp && classes.nativeAppPitchBoxContainer,
        )}
        spacing={8}
      >
        {renderPitchItems}
      </Grid>
    </Grid>
  );

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      hideBackButton: true,
      hideLogo: isMobile,
      hideNavigation: true,
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
      {renderCta}
      {renderPitch}
    </LandingPageTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const tIndex = await getT(locale, 'index');
  const tCommon = await getT(locale, 'common');

  return {
    props: {
      _ns: await loadNamespaces(['index'], locale),
      seoProps: {
        title: tIndex('title'),
        description: tCommon('description'),
      },
    },
  };
};

export default withUserMe(LandingPage);

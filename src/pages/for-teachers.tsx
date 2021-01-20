import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import clsx from 'clsx';
import { ButtonLink, LandingPageTemplate } from 'components';
import { withUserMe } from 'hocs';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { NativeAppPageProps } from 'types';
import { FOR_TEACHERS_PITCH_ITEMS, NATIVE_APP_USER_AGENT, urls } from 'utils';

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
  ctaContainer: {
    flexGrow: 1,
    padding: `${spacing(8)} ${spacing(2)}`,
    paddingTop: 0,
    fontWeight: 'bold',
  },
  ctaHeader: {
    marginTop: spacing(8),
    fontSize: '1rem',
    [breakpoints.up('xs')]: {
      fontSize: '1.25rem',
    },
    [breakpoints.up('sm')]: {
      fontSize: '1.5rem',
    },
    [breakpoints.up('md')]: {
      fontSize: '2rem',
    },
  },
  ctaButton: {
    minWidth: '10rem',
    padding: spacing(3),
    marginTop: spacing(8),
  },
  pitchContainer: {
    overflow: 'hidden',
  },
  pitchBoxContainer: {
    backgroundColor: palette.grey[300],
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

const ForTeachersPage: NextPage<NativeAppPageProps> = ({ seoProps, nativeApp }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const renderCtaHeader = (
    <Typography className={classes.ctaHeader} variant="subtitle1" color="secondary" align="center">
      {t('for-teachers:ctaHeader')}
    </Typography>
  );

  const renderCtaSubheader = (
    <Typography variant="body2" color="secondary" align="center">
      {t('for-teachers:ctaSubheader')}
    </Typography>
  );

  const renderCtaButton = (
    <ButtonLink
      className={classes.ctaButton}
      href={urls.contact}
      color="primary"
      variant="contained"
      endIcon={<ArrowForwardOutlined />}
    >
      {t('for-teachers:cta')}
    </ButtonLink>
  );

  const renderCta = (
    <Grid
      className={classes.ctaContainer}
      container
      direction="column"
      alignItems="center"
      justify="center"
    >
      <Grid item xs={12} md={10} lg={8} xl={6} container direction="column" alignItems="center">
        {renderCtaHeader}
        {renderCtaSubheader}
        {renderCtaButton}
      </Grid>
    </Grid>
  );

  const renderPitchItems = FOR_TEACHERS_PITCH_ITEMS.map(({ header, bullets }) => (
    <Grid item xs={12} md={4}>
      <Typography className={classes.pitchHeader} variant="subtitle1">
        {t(header).toUpperCase()}
      </Typography>
      <Divider className={classes.pitchHeaderDivider} />
      {bullets.map((b) => (
        <Typography variant="body2" color="textSecondary">
          {t(b)}
        </Typography>
      ))}
    </Grid>
  ));

  const renderPitch = (
    <Grid className={classes.pitchContainer} container direction="column" alignItems="center">
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

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: t('for-teachers:header'),
      hideForTeachersButton: true,
    },
    hideAppStoreBadges: nativeApp,
  };

  return (
    <LandingPageTemplate {...layoutProps}>
      {renderCta}
      {renderPitch}
    </LandingPageTemplate>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req: { headers }, locale }) => {
  const t = await getT(locale, 'for-teachers');

  return {
    props: {
      _ns: await loadNamespaces(['for-teachers'], locale),
      nativeApp: headers['user-agent'] === NATIVE_APP_USER_AGENT,
      seoProps: {
        title: t('title'),
        description: t('description'),
      },
    },
  };
};

export default withUserMe(ForTeachersPage);

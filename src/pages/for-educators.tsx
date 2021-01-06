import { Divider, Grid, makeStyles, Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { ButtonLink, LandingPageTemplate } from 'components';
import { withUserMe } from 'hocs';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { FOR_EDUCATORS_PITCH_ITEMS, urls } from 'utils';

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
  ctaHeader: {
    marginTop: spacing(8),
    fontSize: '1.25rem',
    [breakpoints.up('md')]: {
      fontSize: '1.5rem',
    },
  },
  ctaContainer: {
    padding: `${spacing(8)} ${spacing(2)}`,
    paddingTop: 0,
    flexGrow: 1,
    fontWeight: 'bold',
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
  pitchHeader: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  pitchHeaderDivider: {
    height: '0.25rem',
    backgroundColor: palette.primary.main,
    marginBottom: spacing(2),
    borderRadius: '0.5rem',
    maxWidth: '10rem',
  },
}));

const ForEducatorsPage: NextPage = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const renderCtaHeader = (
    <Typography className={classes.ctaHeader} variant="subtitle1" color="secondary" align="center">
      {t('for-educators:ctaHeader')}
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
      {t('for-educators:cta')}
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
      {renderCtaHeader}
      {renderCtaButton}
    </Grid>
  );

  const renderPitchItems = FOR_EDUCATORS_PITCH_ITEMS.map(({ header, bullets }) => (
    <Grid item xs={12} md={6}>
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
        md={10}
        lg={8}
        xl={6}
        className={classes.pitchBoxContainer}
        spacing={4}
      >
        {renderPitchItems}
      </Grid>
    </Grid>
  );

  const layoutProps = {
    seoProps: {
      title: t('for-educators:title'),
      description: t('for-educators:description'),
    },
    topNavbarProps: {
      disableForEducatorsButton: true,
    },
  };

  return (
    <LandingPageTemplate {...layoutProps}>
      {renderCta}
      {renderPitch}
    </LandingPageTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['for-educators'], locale),
  },
});

export default withUserMe(ForEducatorsPage);
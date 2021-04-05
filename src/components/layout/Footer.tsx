import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { useAuthContext } from 'context';
import { useTranslation } from 'lib';
import React, { useMemo } from 'react';
import { FooterProps } from 'types';
import { isNotNativeApp, urls } from 'utils';

import { AppStoreBadge, GooglePlayBadge, TextLink } from '../shared';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    backgroundColor: palette.primary.main,
    paddingTop: spacing(8),
    paddingBottom: spacing(8),
    paddingLeft: `env(safe-area-inset-left)`,
    paddingRight: `env(safe-area-inset-right)`,
  },
  header: {
    fontWeight: 'bold',
    marginBottom: spacing(4),
  },
  bottomRow: {
    marginTop: spacing(8),
  },
  appStoreBadgeContainer: {
    position: 'relative',
  },
  appStoreBadgeImageContainer: {
    maxWidth: '20rem',
  },
  container: {
    padding: `0 ${spacing(6)}`,
  },
}));

export const Footer: React.FC<FooterProps> = ({ hideAppStoreBadges }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { userMe } = useAuthContext();

  const renderSkoleHeader = useMemo(
    () => (
      <Typography className={classes.header} variant="subtitle1" color="secondary">
        SKOLE
      </Typography>
    ),
    [classes.header],
  );

  const renderGetStartedLink = useMemo(
    () =>
      !userMe && (
        <TextLink href={urls.index} color="secondary">
          {t('common:getStarted')}
        </TextLink>
      ),
    [t, userMe],
  );

  const renderScoreLink = useMemo(
    () => (
      <TextLink href={urls.score} color="secondary">
        {t('common:score')}
      </TextLink>
    ),
    [t],
  );

  const renderBadgesLink = useMemo(
    () => (
      <TextLink href={urls.badges} color="secondary">
        {t('common:badges')}
      </TextLink>
    ),
    [t],
  );

  const renderContactLink = useMemo(
    () => (
      <TextLink href={urls.contact} color="secondary">
        {t('common:contact')}
      </TextLink>
    ),
    [t],
  );

  const renderSkole = useMemo(
    () => (
      <Grid
        className={classes.container}
        item
        xs={3}
        container
        direction="column"
        alignItems="flex-start"
      >
        {renderSkoleHeader}
        {renderContactLink}
        {renderGetStartedLink}
        {renderScoreLink}
        {renderBadgesLink}
      </Grid>
    ),
    [
      classes.container,
      renderContactLink,
      renderBadgesLink,
      renderGetStartedLink,
      renderScoreLink,
      renderSkoleHeader,
    ],
  );

  const renderLegalHeader = useMemo(
    () => (
      <Typography className={classes.header} variant="subtitle1" color="secondary">
        {t('common:legal').toUpperCase()}
      </Typography>
    ),
    [classes.header, t],
  );

  const renderTermsLink = useMemo(
    () => (
      <TextLink href={urls.terms} color="secondary">
        {t('common:terms')}
      </TextLink>
    ),
    [t],
  );

  const renderPrivacyLink = useMemo(
    () => (
      <TextLink href={urls.privacy} color="secondary">
        {t('common:privacy')}
      </TextLink>
    ),
    [t],
  );

  const renderLegal = useMemo(
    () => (
      <Grid
        className={classes.container}
        item
        xs={3}
        container
        direction="column"
        alignItems="flex-start"
      >
        {renderLegalHeader}
        {renderTermsLink}
        {renderPrivacyLink}
      </Grid>
    ),
    [classes.container, renderLegalHeader, renderTermsLink, renderPrivacyLink],
  );

  const renderCopyright = useMemo(
    () => (
      <Grid className={classes.container} item xs={3} container alignItems="center">
        <Typography variant="subtitle1" color="secondary">
          © {new Date().getFullYear()} Skole
        </Typography>
      </Grid>
    ),
    [classes.container],
  );

  const renderAppStoreBadges = useMemo(
    () =>
      isNotNativeApp &&
      !hideAppStoreBadges && (
        <Grid
          className={clsx(classes.container, classes.appStoreBadgeContainer)}
          item
          xs={6}
          container
          justify="flex-end"
        >
          <Grid
            className={classes.appStoreBadgeImageContainer}
            container
            item
            xs={12}
            justify="center"
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
    [
      classes.appStoreBadgeContainer,
      classes.appStoreBadgeImageContainer,
      classes.container,
      hideAppStoreBadges,
    ],
  );

  return (
    <Grid container className={classes.root} justify="center">
      <Container>
        <Grid container>
          {renderSkole}
          {renderLegal}
          {renderAppStoreBadges}
        </Grid>
        <Grid className={classes.bottomRow} container>
          {renderCopyright}
        </Grid>
      </Container>
    </Grid>
  );
};

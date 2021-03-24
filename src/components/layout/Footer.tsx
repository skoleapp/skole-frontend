import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { useAuthContext } from 'context';
import { useTranslation } from 'lib';
import Image from 'next/image';
import React from 'react';
import { FooterProps } from 'types';
import { isNotNativeApp, urls } from 'utils';

import { AppStoreBadge, GooglePlayBadge, TextLink } from '../shared';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    backgroundColor: palette.primary.main,
    paddingTop: spacing(8),
    paddingBottom: spacing(8),
    paddingLeft: `calc(env(safe-area-inset-left) + ${spacing(2)})`,
    paddingRight: `calc(env(safe-area-inset-right) + ${spacing(2)})`,
  },
  header: {
    fontWeight: 'bold',
    marginBottom: spacing(4),
  },
  socialMediaIcon: {
    color: palette.secondary.main,
    padding: `${spacing(2)} !important`,
  },
  bottomRow: {
    marginTop: spacing(8),
  },
  privacyLink: {
    marginLeft: spacing(2),
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

  const handleClickSocialMediaLink = (name: string) => (): void =>
    sa_event(`click_${name}_footer_link`);

  const renderSkoleHeader = (
    <Typography className={classes.header} variant="subtitle1" color="secondary">
      SKOLE
    </Typography>
  );

  const renderGetStartedLink = !userMe && (
    <TextLink href={urls.index} color="secondary">
      {t('common:getStarted')}
    </TextLink>
  );

  const renderGuidelinesLink = (
    <TextLink href={urls.guidelines} color="secondary">
      {t('common:guidelines')}
    </TextLink>
  );

  const renderScoreLink = (
    <TextLink href={urls.score} color="secondary">
      {t('common:score')}
    </TextLink>
  );

  const renderBadgesLink = (
    <TextLink href={urls.badges} color="secondary">
      {t('common:badges')}
    </TextLink>
  );

  const renderFeedbackLink = (
    <TextLink href={urls.contact} color="secondary">
      {t('common:feedback')}
    </TextLink>
  );

  const renderSkole = (
    <Grid
      className={classes.container}
      item
      xs={4}
      container
      direction="column"
      alignItems="flex-start"
    >
      {renderSkoleHeader}
      {renderGetStartedLink}
      {renderGuidelinesLink}
      {renderScoreLink}
      {renderBadgesLink}
      {renderFeedbackLink}
    </Grid>
  );

  const renderCompanyHeader = (
    <Typography className={classes.header} variant="subtitle1" color="secondary">
      {t('common:company').toUpperCase()}
    </Typography>
  );

  const renderContactLink = (
    <TextLink href={urls.contact} color="secondary">
      {t('common:contact')}
    </TextLink>
  );

  const renderValuesLink = (
    <TextLink href={urls.values} color="secondary">
      {t('common:values')}
    </TextLink>
  );

  const renderCompany = (
    <Grid
      className={classes.container}
      item
      xs={4}
      container
      direction="column"
      alignItems="flex-start"
    >
      {renderCompanyHeader}
      {renderContactLink}
      {renderValuesLink}
    </Grid>
  );

  const socialMediaLinks = [
    {
      href: 'https://www.facebook.com/skoleofficial',
      name: 'facebook',
    },
    {
      href: 'https://www.instagram.com/skoleofficial/',
      name: 'instagram',
    },
    {
      href: 'https://twitter.com/skoleofficial',
      name: 'twitter',
    },
    {
      href: 'https://www.linkedin.com/company/skole-inc',
      name: 'linkedin',
    },
  ];

  const mapSocialMediaLinks = socialMediaLinks.map(({ href, name }, i) => (
    <Typography
      component="a"
      target="_blank"
      rel="noreferrer"
      href={href}
      onClick={handleClickSocialMediaLink(name)}
      key={i}
    >
      <Image
        className={classes.socialMediaIcon}
        src={`/images/footer-social-media-icons/${name}.svg`}
        width={40}
        height={40}
      />
    </Typography>
  ));

  const renderSocialMediaLinks = (
    <Grid
      className={classes.container}
      item
      xs={4}
      container
      direction="column"
      alignItems="center"
    >
      <Typography className={classes.header} variant="subtitle1" color="secondary">
        #studyinskole
      </Typography>
      <Box>{mapSocialMediaLinks}</Box>
    </Grid>
  );

  const renderCopyright = (
    <Grid className={classes.container} item xs={4} container alignItems="center">
      <Typography variant="subtitle1" color="secondary">
        © {new Date().getFullYear()} Skole
      </Typography>
    </Grid>
  );

  const renderTermsLink = (
    <TextLink href={urls.terms} color="secondary">
      {t('common:terms')}
    </TextLink>
  );

  const renderPrivacyLink = (
    <TextLink className={classes.privacyLink} href={urls.privacy} color="secondary">
      {t('common:privacy')}
    </TextLink>
  );

  const renderLegal = (
    <Grid className={classes.container} item xs={4} container alignItems="center">
      {renderTermsLink}
      {renderPrivacyLink}
    </Grid>
  );

  const renderAppStoreBadges = isNotNativeApp && !hideAppStoreBadges && (
    <Grid
      className={clsx(classes.container, classes.appStoreBadgeContainer)}
      item
      xs={4}
      container
      justify="center"
    >
      <Grid className={classes.appStoreBadgeImageContainer} container justify="center">
        <Grid item xs={6}>
          <AppStoreBadge />
        </Grid>
        <Grid item xs={6}>
          <GooglePlayBadge />
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    <Grid container className={classes.root} justify="center">
      <Grid item xs={12} xl={8} container>
        <Grid item xs={12} container>
          {renderSkole}
          {renderCompany}
          {renderSocialMediaLinks}
        </Grid>
        <Grid className={classes.bottomRow} item xs={12} container>
          {renderCopyright}
          {renderLegal}
          {renderAppStoreBadges}
        </Grid>
      </Grid>
    </Grid>
  );
};

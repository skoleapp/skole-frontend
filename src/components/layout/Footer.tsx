import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useAuthContext } from 'context';
import { useTranslation } from 'lib';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { isNotNativeApp, urls } from 'utils';

import { AppStoreBadge, GooglePlayBadge, TextLink } from '../shared';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    backgroundColor: palette.primary.main,
    paddingTop: spacing(8),
    paddingBottom: spacing(8),
    paddingLeft: `calc(env(safe-area-inset-left) + ${spacing(4)})`,
    paddingRight: `calc(env(safe-area-inset-right) + ${spacing(4)})`,
    zIndex: 1,
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
}));

export const Footer: React.FC = () => {
  const classes = useStyles();
  const { pathname } = useRouter();
  const { t } = useTranslation();
  const { userMe } = useAuthContext();

  const handleClickSocialMediaLink = (name: string) => () =>
    sa_event(`click_${name}_footer_link_from_${pathname}`);

  const renderProductHeader = (
    <Typography className={classes.header} variant="subtitle1" color="secondary">
      {t('common:product').toUpperCase()}
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

  const renderForTeachersLink = (
    <TextLink href={urls.forTeachers} color="secondary">
      {t('common:forTeachers')}
    </TextLink>
  );

  const renderUpdatesLink = (
    <TextLink href={urls.updates} color="secondary">
      {t('common:updates')}
    </TextLink>
  );

  const renderContactLink = (
    <TextLink href={urls.contact} color="secondary">
      {t('common:contact')}
    </TextLink>
  );

  const renderProduct = (
    <Grid item xs={4} container direction="column" alignItems="flex-start">
      {renderProductHeader}
      {renderGetStartedLink}
      {renderGuidelinesLink}
      {renderScoreLink}
      {renderForTeachersLink}
      {renderUpdatesLink}
    </Grid>
  );

  const renderCompanyHeader = (
    <Typography className={classes.header} variant="subtitle1" color="secondary">
      {t('common:company').toUpperCase()}
    </Typography>
  );

  const renderBlogLink = (
    <TextLink href={urls.blogs} color="secondary">
      {t('common:blog')}
    </TextLink>
  );

  const renderValuesLink = (
    <TextLink href={urls.values} color="secondary">
      {t('common:values')}
    </TextLink>
  );

  const renderCompany = (
    <Grid item xs={4} container direction="column" alignItems="flex-start">
      {renderCompanyHeader}
      {renderContactLink}
      {renderBlogLink}
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

  const mapSocialMediaLinks = socialMediaLinks.map(({ href, name }) => (
    <Typography
      component="a"
      target="_blank"
      rel="noreferrer"
      href={href}
      onClick={handleClickSocialMediaLink(name)}
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
    <Grid item xs={4} container direction="column" alignItems="center">
      <Typography className={classes.header} variant="subtitle1" color="secondary">
        #studyinskole
      </Typography>
      <Box>{mapSocialMediaLinks}</Box>
    </Grid>
  );

  const renderCopyright = (
    <Grid container xs={4} alignItems="center">
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
    <Grid item xs={4} container alignItems="center">
      {renderTermsLink}
      {renderPrivacyLink}
    </Grid>
  );

  const renderAppStoreBadges = isNotNativeApp && (
    <Grid className={classes.appStoreBadgeContainer} item xs={4} container justify="center">
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
      <Grid item xs={12} lg={10} xl={7} container>
        <Grid item xs={12} container>
          {renderProduct}
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

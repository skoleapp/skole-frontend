import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useAuthContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';
import { urls } from 'utils';

import { TextLink } from '../shared';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    backgroundColor: palette.primary.main,
    padding: spacing(4),
  },
  copyRightSection: {
    marginTop: spacing(8),
  },
}));

export const Footer: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { userMe } = useAuthContext();

  const renderSkoleHeader = (
    <Typography variant="subtitle1" color="secondary" gutterBottom>
      SKOLE
    </Typography>
  );

  const renderGetStartedLink = !userMe && (
    <TextLink href={urls.index} color="secondary">
      {t('common:getStarted')}
    </TextLink>
  );

  const renderForTeachersLink = (
    <TextLink href={urls.forTeachers} color="secondary">
      {t('common:forTeachers')}
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

  const renderContactLink = (
    <TextLink href={urls.contact} color="secondary">
      {t('common:contact')}
    </TextLink>
  );

  const renderSkole = (
    <Grid item xs={4} container justify="center">
      <Box display="flex" flexDirection="column">
        {renderSkoleHeader}
        {renderGetStartedLink}
        {renderForTeachersLink}
        {renderGuidelinesLink}
        {renderScoreLink}
        {renderContactLink}
      </Box>
    </Grid>
  );

  const renderCompanyHeader = (
    <Typography variant="subtitle1" color="secondary" gutterBottom>
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

  const renderTermsLink = (
    <TextLink href={urls.terms} color="secondary">
      {t('common:terms')}
    </TextLink>
  );

  const renderPrivacyLink = (
    <TextLink href={urls.privacy} color="secondary">
      {t('common:privacy')}
    </TextLink>
  );

  const renderCompany = (
    <Grid item xs={4} container justify="center">
      <Box display="flex" flexDirection="column">
        {renderCompanyHeader}
        {renderBlogLink}
        {renderValuesLink}
        {renderTermsLink}
        {renderPrivacyLink}
      </Box>
    </Grid>
  );

  const renderSocialHeader = (
    <Typography variant="subtitle1" color="secondary" gutterBottom>
      {t('common:social').toUpperCase()}
    </Typography>
  );

  const renderFacebookLink = (
    <TextLink
      href="https://www.facebook.com/skoleofficial"
      color="secondary"
      target="_blank"
      rel="noreferrer"
    >
      Facebook
    </TextLink>
  );

  const renderInstagramLink = (
    <TextLink
      href="https://www.instagram.com/skoleofficial/"
      color="secondary"
      target="_blank"
      rel="noreferrer"
    >
      Instagram
    </TextLink>
  );

  const renderTwitterLink = (
    <TextLink
      href="https://twitter.com/skoleofficial"
      color="secondary"
      target="_blank"
      rel="noreferrer"
    >
      Twitter
    </TextLink>
  );

  const renderLinkedInLink = (
    <TextLink
      href="https://www.linkedin.com/company/skole-inc"
      color="secondary"
      target="_blank"
      rel="noreferrer"
    >
      LinkedIn
    </TextLink>
  );

  const renderSocial = (
    <Grid item xs={4} container justify="center">
      <Box display="flex" flexDirection="column">
        {renderSocialHeader}
        {renderFacebookLink}
        {renderInstagramLink}
        {renderTwitterLink}
        {renderLinkedInLink}
      </Box>
    </Grid>
  );

  const renderCopyRight = (
    <Typography variant="subtitle1" color="secondary">
      © {new Date().getFullYear()} Skole
    </Typography>
  );

  return (
    <Grid container className={classes.root} justify="center">
      <Grid item xs={12} lg={8} xl={6} container>
        {renderSkole}
        {renderCompany}
        {renderSocial}
      </Grid>
      <Grid item xs={12} container justify="center" className={classes.copyRightSection}>
        {renderCopyRight}
      </Grid>
    </Grid>
  );
};

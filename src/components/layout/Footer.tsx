import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'lib';
import React from 'react';
import { urls } from 'utils';

import { LanguageButton, TextLink } from '../shared';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    backgroundColor: palette.primary.main,
    padding: spacing(4),
  },
  copyRightSection: {
    marginTop: spacing(2),
  },
}));

export const Footer: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const renderCompany = (
    <Grid item xs={4} container justify="center">
      <Box display="flex" flexDirection="column">
        <Typography variant="subtitle1" color="secondary" gutterBottom>
          SKOLE
        </Typography>
        <TextLink href={urls.getStarted} color="secondary">
          {t('common:getStarted')}
        </TextLink>
        <TextLink href={urls.contact} color="secondary">
          {t('common:contact')}
        </TextLink>
        <TextLink href={urls.forEducators} color="secondary">
          {t('common:forEducators')}
        </TextLink>
        <TextLink href={urls.terms} color="secondary">
          {t('common:terms')}
        </TextLink>
        <TextLink href={urls.privacy} color="secondary">
          {t('common:privacy')}
        </TextLink>
      </Box>
    </Grid>
  );

  const renderLanguageHeader = (
    <Typography variant="subtitle1" color="secondary" gutterBottom>
      {t('common:language').toUpperCase()}
    </Typography>
  );

  const renderLanguageButton = <LanguageButton />;

  const renderLanguage = (
    <Grid item xs={4} container direction="column" alignItems="center">
      {renderLanguageHeader}
      {renderLanguageButton}
    </Grid>
  );

  const renderSocial = (
    <Grid item xs={4} container justify="center">
      <Box display="flex" flexDirection="column">
        <Typography variant="subtitle1" color="secondary" gutterBottom>
          {t('common:social').toUpperCase()}
        </Typography>
        <TextLink
          href="https://www.facebook.com/skoleofficial"
          color="secondary"
          target="_blank"
          rel="noreferrer"
        >
          Facebook
        </TextLink>
        <TextLink
          href="https://www.instagram.com/skoleofficial/"
          color="secondary"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </TextLink>
        <TextLink
          href="https://twitter.com/skoleofficial"
          color="secondary"
          target="_blank"
          rel="noreferrer"
        >
          Twitter
        </TextLink>
        <TextLink
          href="https://www.linkedin.com/company/skole-inc"
          color="secondary"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </TextLink>
      </Box>
    </Grid>
  );

  const renderCopyRight = (
    <Typography variant="subtitle1" color="secondary">
      © {new Date().getFullYear()} Skole
    </Typography>
  );

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} container>
        {renderCompany}
        {renderLanguage}
        {renderSocial}
      </Grid>
      <Grid item xs={12} container justify="center" className={classes.copyRightSection}>
        {renderCopyRight}
      </Grid>
    </Grid>
  );
};

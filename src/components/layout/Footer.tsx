import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
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

  const renderSkole = (
    <Grid item xs={4} container justify="center">
      <Box display="flex" flexDirection="column">
        <Typography variant="subtitle1" color="secondary" gutterBottom>
          SKOLE
        </Typography>
        <TextLink href={urls.getStarted} color="secondary">
          {t('common:getStarted')}
        </TextLink>
        <TextLink href={urls.forTeachers} color="secondary">
          {t('common:forTeachers')}
        </TextLink>
        <TextLink href={urls.guidelines} color="secondary">
          {t('common:guidelines')}
        </TextLink>
        <TextLink href={urls.score} color="secondary">
          {t('common:score')}
        </TextLink>
      </Box>
    </Grid>
  );

  const renderCompany = (
    <Grid item xs={4} container justify="center">
      <Box display="flex" flexDirection="column">
        <Typography variant="subtitle1" color="secondary" gutterBottom>
          {t('common:company').toUpperCase()}
        </Typography>
        <TextLink href={urls.contact} color="secondary">
          {t('common:contact')}
        </TextLink>
        <TextLink href={urls.terms} color="secondary">
          {t('common:terms')}
        </TextLink>
        <TextLink href={urls.privacy} color="secondary">
          {t('common:privacy')}
        </TextLink>
        <TextLink href={urls.score} color="secondary">
          {t('common:values')}
        </TextLink>
      </Box>
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

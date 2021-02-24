import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { urls } from 'utils';

import { TextLink } from './TextLink';

const useStyles = makeStyles(({ spacing }) => ({
  guestAuthorText: {
    marginTop: spacing(8),
  },
}));

export const RequestFeatureLink: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const requestFeatureText = t('updates:requestFeatureText');

  const requestFeatureLink = (
    <TextLink href={urls.contact}>{t('updates:requestFeatureLink')}</TextLink>
  );

  return (
    <Typography className={classes.guestAuthorText} variant="body2" align="center">
      {requestFeatureText} {requestFeatureLink}
    </Typography>
  );
};

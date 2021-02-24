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

export const GuestAuthorLink: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const guestAuthorText = t('blogs:guestAuthorText');

  const renderGuestAuthorLink = (
    <TextLink href={urls.contact}>{t('blogs:guestAuthorLink')}</TextLink>
  );

  return (
    <Typography className={classes.guestAuthorText} variant="body2" align="center">
      {guestAuthorText} {renderGuestAuthorLink}
    </Typography>
  );
};

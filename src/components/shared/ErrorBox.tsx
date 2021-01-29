import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export const ErrorBox: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid className={classes.root} container justify="center" alignItems="center">
      <Typography variant="subtitle1" color="textSecondary">
        {t('common:unexpectedError')}
      </Typography>
    </Grid>
  );
};

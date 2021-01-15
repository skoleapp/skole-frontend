import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'lib';
import React from 'react';

const useStyles = makeStyles(({ palette }) => ({
  root: {
    flexGrow: 1,
    backgroundColor: palette.common.white,
  },
}));

interface Props {
  text?: string;
}

export const LoadingBox: React.FC<Props> = ({ text }) => {
  const { spacing } = useTheme();
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Grid
      className={classes.root}
      container
      direction="column"
      alignItems="center"
      justify="center"
    >
      <CircularProgress color="primary" disableShrink size={40} />
      <Box marginTop={spacing(2)}>
        <Typography variant="subtitle1" color="textSecondary">
          {text || t('common:loading')}
        </Typography>
      </Box>
    </Grid>
  );
};

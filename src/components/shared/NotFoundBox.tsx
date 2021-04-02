import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MoodBadOutlined from '@material-ui/icons/MoodBadOutlined';
import React, { useMemo } from 'react';

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    flexGrow: 1,
    padding: spacing(4),
    textAlign: 'center',
    backgroundColor: palette.background.paper,
    minHeight: '15rem',
  },
  icon: {
    width: '3.5rem',
    height: '3.5rem',
    marginBottom: spacing(2),
  },
}));

interface Props {
  text: string;
}

export const NotFoundBox: React.FC<Props> = ({ text, children }) => {
  const classes = useStyles();
  const renderIcon = <MoodBadOutlined className={classes.icon} color="disabled" />;

  const renderText = useMemo(
    () => (
      <Typography variant="body2" color="textSecondary">
        {text}
      </Typography>
    ),
    [text],
  );

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.root}
    >
      {renderIcon}
      {renderText}
      {children}
    </Grid>
  );
};

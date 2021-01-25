import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles(({ palette }) => ({
  root: {
    color: palette.text.primary,
    fontSize: 'inherit',
  },
}));

interface Props {
  emoji: string;
  noSpace?: boolean;
}

// A non-breaking space followed by the emoji. The emoji has a forced text color for consistency.
export const Emoji: React.FC<Props> = ({ emoji, noSpace }) => {
  const classes = useStyles();
  const renderSpace = !noSpace && <>&nbsp;</>;

  return (
    <Typography className={classes.root} component="span">
      {renderSpace}
      {emoji}
    </Typography>
  );
};

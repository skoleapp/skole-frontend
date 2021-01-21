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
  hideSpace?: boolean;
}

// Force consistent text color for all emojis. Do not set a normal space before this component.
export const Emoji: React.FC<Props> = ({ emoji, hideSpace }) => {
  const classes = useStyles();
  const renderSpace = !hideSpace && <>&nbsp;</>;

  return (
    <Typography className={classes.root} component="span">
      {renderSpace}
      {emoji}
    </Typography>
  );
};

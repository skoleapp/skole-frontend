import { makeStyles } from '@material-ui/core/styles';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(({ palette }) => ({
  root: {
    color: palette.text.primary,
    fontSize: 'inherit',
  },
}));

interface Props extends Pick<TypographyProps, 'className'> {
  emoji: string;
  noSpace?: boolean;
}

// A non-breaking space followed by the emoji. The emoji has a forced text color for consistency.
export const Emoji: React.FC<Props> = ({ emoji, noSpace, className }) => {
  const classes = useStyles();
  const renderSpace = !noSpace && <>&nbsp;</>;

  return (
    <Typography className={clsx(classes.root, className)} component="span">
      {renderSpace}
      {emoji}
    </Typography>
  );
};

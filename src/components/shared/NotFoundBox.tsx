import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MoodBadOutlined from '@material-ui/icons/MoodBadOutlined';
import React from 'react';
import { UrlObject } from 'url';

import { TextLink } from './TextLink';

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
  linkProps?: {
    href: string | UrlObject;
    text: string;
  };
}

export const NotFoundBox: React.FC<Props> = ({ text, linkProps }) => {
  const classes = useStyles();
  const renderIcon = <MoodBadOutlined className={classes.icon} color="disabled" />;
  const renderLink = !!linkProps && <TextLink href={linkProps.href}>{linkProps.text}</TextLink>;

  const renderText = (
    <Typography variant="body2" color="textSecondary">
      {text}
    </Typography>
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
      {renderLink}
    </Grid>
  );
};

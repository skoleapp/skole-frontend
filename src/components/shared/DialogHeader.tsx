import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
import clsx from 'clsx';
import { useTranslation } from 'lib';
import React from 'react';
import { TOP_NAVBAR_HEIGHT_MOBILE } from 'theme';
import { DialogHeaderProps } from 'types';

import { Emoji } from './Emoji';

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    padding: spacing(2),
    minHeight: TOP_NAVBAR_HEIGHT_MOBILE,
  },
  text: {
    color: palette.text.secondary,
  },
}));

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  text,
  emoji,
  onCancel,
  renderHeaderLeft,
  headerCenter,
  renderHeaderRight,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const renderCloseButton = (
    <Tooltip title={t('common-tooltips:closeMenu')}>
      <IconButton onClick={onCancel} size="small">
        <CloseOutlined />
      </IconButton>
    </Tooltip>
  );

  const renderEmoji = !!emoji && <Emoji emoji={emoji} />;

  const renderHeaderText = (
    <Typography className={clsx('MuiCardHeader-title', classes.text, 'truncate-text')} variant="h6">
      {text}
      {renderEmoji}
    </Typography>
  );

  return (
    <Grid container className={classes.root}>
      <Grid item xs={2} sm={1} container justify="flex-start" alignItems="flex-start">
        {renderHeaderLeft}
      </Grid>
      <Grid item xs={8} sm={10} container justify="center" alignItems="center">
        {headerCenter || renderHeaderText}
      </Grid>
      <Grid item xs={2} sm={1} container justify="flex-end" alignItems="flex-start">
        {renderHeaderRight || renderCloseButton}
      </Grid>
    </Grid>
  );
};

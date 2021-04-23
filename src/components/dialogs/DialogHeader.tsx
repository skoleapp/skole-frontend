import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
import clsx from 'clsx';
import { useTranslation } from 'lib';
import React, { useMemo } from 'react';
import { TOP_NAVBAR_HEIGHT_MOBILE } from 'styles';
import { DialogHeaderProps } from 'types';

import { Emoji } from '../shared';

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
  onClose,
  renderHeaderLeft,
  headerCenter,
  renderHeaderRight,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const renderCloseButton = useMemo(
    () => (
      <Tooltip title={t('common-tooltips:exit')}>
        <IconButton onClick={onClose} size="small">
          <CloseOutlined />
        </IconButton>
      </Tooltip>
    ),
    [onClose, t],
  );

  const renderEmoji = useMemo(() => !!emoji && <Emoji emoji={emoji} />, [emoji]);

  const renderHeaderText = useMemo(
    () => (
      <Typography
        className={clsx('MuiCardHeader-title', classes.text, 'truncate-text')}
        variant="h6"
      >
        {text}
        {renderEmoji}
      </Typography>
    ),
    [classes.text, renderEmoji, text],
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

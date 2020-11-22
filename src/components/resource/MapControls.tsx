import { Box, Fab, makeStyles, Size, Tooltip, Typography } from '@material-ui/core';
import {
  AddOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  RemoveOutlined,
} from '@material-ui/icons';
import { useTranslation } from 'lib';
import React from 'react';
import { MuiColor } from 'types';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    position: 'absolute',
    bottom: spacing(4),
    right: spacing(4),
    display: 'flex',
    flexDirection: 'column',
    padding: spacing(2),
  },
  button: {
    margin: spacing(2),
  },
}));

interface Props {
  handleFullscreenButtonClick: () => void;
  handleScaleUpButtonClick: () => void;
  handleScaleDownButtonClick: () => void;
  fullscreen: boolean;
  controlsDisabled: boolean;
}

export const MapControls: React.FC<Props> = ({
  handleFullscreenButtonClick,
  handleScaleUpButtonClick,
  handleScaleDownButtonClick,
  fullscreen,
  controlsDisabled,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const commonButtonProps = {
    className: classes.button,
    size: 'small' as Size,
    color: 'secondary' as MuiColor,
    disabled: controlsDisabled,
  };

  const renderFullscreenButton = (
    <Tooltip title={fullscreen ? t('tooltips:exitFullscreen') : t('tooltips:enterFullscreen')}>
      <Typography component="span">
        <Fab {...commonButtonProps} onClick={handleFullscreenButtonClick}>
          {fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        </Fab>
      </Typography>
    </Tooltip>
  );

  const renderDownscaleButton = (
    <Tooltip title={t('tooltips:zoomIn')}>
      <Typography component="span">
        <Fab {...commonButtonProps} onClick={handleScaleUpButtonClick}>
          <AddOutlined />
        </Fab>
      </Typography>
    </Tooltip>
  );

  const renderUpscaleButton = (
    <Tooltip title={t('tooltips:zoomOut')}>
      <Typography component="span">
        <Fab {...commonButtonProps} onClick={handleScaleDownButtonClick}>
          <RemoveOutlined />
        </Fab>
      </Typography>
    </Tooltip>
  );

  return (
    <Box className={classes.root}>
      {renderFullscreenButton}
      {renderDownscaleButton}
      {renderUpscaleButton}
    </Box>
  );
};

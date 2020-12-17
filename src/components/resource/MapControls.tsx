import { Box, Fab, Size, makeStyles, Tooltip, Typography } from '@material-ui/core';
import {
  AddOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  RemoveOutlined,
} from '@material-ui/icons';
import { usePdfViewerContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';
import { MuiColor } from 'types';
import { PDF_DEFAULT_SCALE, PDF_DEFAULT_TRANSLATION, PDF_MIN_SCALE, PDF_MAX_SCALE } from 'utils';

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

export const MapControls: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const {
    fullscreen,
    setFullscreen,
    setTranslation,
    scale,
    setScale,
    controlsDisabled,
    centerHorizontalScroll,
  } = usePdfViewerContext();

  const handleFullscreenButtonClick = (): void => {
    let scale;

    if (fullscreen) {
      scale = PDF_MIN_SCALE;
    } else {
      scale = PDF_DEFAULT_SCALE;
    }

    setFullscreen(!fullscreen);
    setScale(scale);
    setTranslation(PDF_DEFAULT_TRANSLATION);
  };

  const handleScale = async (newScale: number): Promise<void> => {
    setFullscreen(false);
    newScale == PDF_DEFAULT_SCALE && setFullscreen(true);
    await setScale(newScale); // Wait until new scale has been applied and center horizontal scroll only after that to avoid lagginess.
    centerHorizontalScroll();
  };

  const handleScaleUpButtonClick = (): Promise<void> =>
    handleScale(scale < PDF_MAX_SCALE ? scale + 0.05 : scale); // Scale up by 5% if under maximum limit.

  const handleScaleDownButtonClick = (): Promise<void> =>
    handleScale(scale > PDF_MIN_SCALE ? scale - 0.05 : scale); // Scale down by 5% if over minimum limit

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

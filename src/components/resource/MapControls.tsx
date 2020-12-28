import { Box, Fab, Size, makeStyles, Tooltip, Typography } from '@material-ui/core';
import {
  AddOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  RemoveOutlined,
} from '@material-ui/icons';
import { usePdfViewerContext } from 'context';
import { useTranslation } from 'lib';
import React, { Dispatch, SetStateAction } from 'react';
import { MuiColor, PdfTranslation } from 'types';
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

interface Props {
  scale: number;
  setScale: Dispatch<SetStateAction<number>>;
  setTranslation: Dispatch<SetStateAction<PdfTranslation>>;
}

export const MapControls: React.FC<Props> = ({ setTranslation, scale, setScale }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const {
    fullscreen,
    setFullscreen,
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
    <Tooltip
      title={
        fullscreen ? t('resource-tooltips:exitFullscreen') : t('resource-tooltips:enterFullscreen')
      }
    >
      <Typography component="span">
        <Fab {...commonButtonProps} onClick={handleFullscreenButtonClick}>
          {fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        </Fab>
      </Typography>
    </Tooltip>
  );

  const renderDownscaleButton = (
    <Tooltip title={t('resource-tooltips:zoomIn')}>
      <Typography component="span">
        <Fab {...commonButtonProps} onClick={handleScaleUpButtonClick}>
          <AddOutlined />
        </Fab>
      </Typography>
    </Tooltip>
  );

  const renderUpscaleButton = (
    <Tooltip title={t('resource-tooltips:zoomOut')}>
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

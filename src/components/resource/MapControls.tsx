import Box from '@material-ui/core/Box';
import Fab, { FabProps } from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddOutlined from '@material-ui/icons/AddOutlined';
import FullscreenExitOutlined from '@material-ui/icons/FullscreenExitOutlined';
import FullscreenOutlined from '@material-ui/icons/FullscreenOutlined';
import RemoveOutlined from '@material-ui/icons/RemoveOutlined';
import { usePdfViewerContext } from 'context';
import { useTranslation } from 'lib';
import React, { Dispatch, SetStateAction } from 'react';
import { PdfTranslation } from 'types';
import { PDF_DEFAULT_SCALE, PDF_DEFAULT_TRANSLATION, PDF_MAX_SCALE, PDF_MIN_SCALE } from 'utils';

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

  const fullscreenButtonTooltip = fullscreen
    ? t('resource-tooltips:exitFullscreen')
    : t('resource-tooltips:enterFullscreen');

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

  const commonButtonProps: Partial<FabProps> = {
    className: classes.button,
    size: 'small',
    color: 'secondary',
    disabled: controlsDisabled,
  };

  const renderFullscreenButtonIcon = fullscreen ? (
    <FullscreenExitOutlined />
  ) : (
    <FullscreenOutlined />
  );

  const renderFullscreenButton = (
    <Tooltip title={fullscreenButtonTooltip}>
      <Typography component="span">
        <Fab {...commonButtonProps} onClick={handleFullscreenButtonClick}>
          {renderFullscreenButtonIcon}
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

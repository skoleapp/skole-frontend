import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import RotateRightOutlined from '@material-ui/icons/RotateRightOutlined';
import { usePdfViewerContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';

export const RotateButton: React.FC = () => {
  const { t } = useTranslation();
  const { rotate, setRotate, controlsDisabled } = usePdfViewerContext();

  const handleRotateButtonClick = (): void =>
    rotate === 270 ? setRotate(0) : setRotate(rotate + 90);

  return (
    <Tooltip title={t('resource-tooltips:rotatePdf')}>
      <Typography component="span">
        <IconButton size="small" onClick={handleRotateButtonClick} disabled={controlsDisabled}>
          <RotateRightOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  );
};

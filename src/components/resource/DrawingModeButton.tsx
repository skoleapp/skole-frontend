import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import TabUnselectedOutlined from '@material-ui/icons/TabUnselectedOutlined';
import { usePdfViewerContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';

export const DrawingModeButton: React.FC = () => {
  const { t } = useTranslation();
  const { setDrawingMode, controlsDisabled } = usePdfViewerContext();
  const handleClick = (): void => setDrawingMode(true);

  return (
    <Tooltip title={t('resource-tooltips:drawingMode')}>
      <Typography component="span">
        <IconButton onClick={handleClick} disabled={controlsDisabled} size="small">
          <TabUnselectedOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  );
};

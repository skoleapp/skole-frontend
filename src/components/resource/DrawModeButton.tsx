import { IconButton, Tooltip, Typography } from '@material-ui/core';
import { TabUnselectedOutlined } from '@material-ui/icons';
import { usePdfViewerContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';

export const DrawModeButton: React.FC = () => {
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

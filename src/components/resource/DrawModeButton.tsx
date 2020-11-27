import { IconButton, Tooltip, Typography } from '@material-ui/core';
import { TabUnselectedOutlined } from '@material-ui/icons';
import { usePdfViewerContext } from 'context';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';

// Currently, we disable this button for desktop devices and completely hide it for mobile devices.
// TODO: Enable this when we have fixed the draw mode feature.
export const DrawModeButton: React.FC = () => {
  const { t } = useTranslation();
  const { isMobile, isTabletOrDesktop } = useMediaQueries();
  const { setDrawMode, controlsDisabled } = usePdfViewerContext();
  const color = isMobile ? 'default' : 'secondary';
  const handleClick = (): void => setDrawMode(true);

  return isTabletOrDesktop ? (
    <Tooltip title={t('tooltips:markArea')}>
      <Typography component="span">
        <IconButton
          onClick={handleClick}
          disabled={controlsDisabled} // The actual logic that we want to use when we enable this component.
          size="small"
          color={color}
        >
          <TabUnselectedOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  ) : null;
};

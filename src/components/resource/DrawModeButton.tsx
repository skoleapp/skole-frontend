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
  const { isMobileOrTablet, isDesktop } = useMediaQueries();

  const {
    setDrawMode,
    // controlsDisabled
  } = usePdfViewerContext();

  const color = isMobileOrTablet ? 'default' : 'secondary';
  const handleClick = (): void => setDrawMode(true);

  return isDesktop ? (
    <Tooltip title={t('tooltips:markArea')}>
      <Typography component="span">
        <IconButton
          onClick={handleClick}
          // disabled={controlsDisabled} // The actual logic that we want to use when we enable this component.
          disabled // Explicitly disabled for now.
          size="small"
          color={color}
        >
          <TabUnselectedOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  ) : null;
};

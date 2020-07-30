import { IconButton, Tooltip } from '@material-ui/core';
import { TabUnselectedOutlined } from '@material-ui/icons';
import { useDeviceContext, usePDFViewerContext } from 'context';
import { useResponsiveIconButtonProps } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';

export const DrawModeButton: React.FC = () => {
    const { t } = useTranslation();
    const isMobile = useDeviceContext();
    const { setDrawMode, controlsDisabled } = usePDFViewerContext();
    const { size } = useResponsiveIconButtonProps();
    const color = isMobile ? 'default' : 'secondary';
    const handleClick = (): void => setDrawMode(true);

    return (
        <Tooltip title={t('tooltips:markArea')}>
            <span>
                <IconButton onClick={handleClick} disabled={controlsDisabled} size={size} color={color}>
                    <TabUnselectedOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );
};

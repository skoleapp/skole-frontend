import { IconButton, Tooltip } from '@material-ui/core';
import { TabUnselectedOutlined } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDeviceContext, usePDFViewerContext } from 'src/context';
import { useResponsiveIconButtonProps } from 'src/utils';

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

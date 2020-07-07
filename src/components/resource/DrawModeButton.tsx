import { IconButton, Tooltip } from '@material-ui/core';
import { TabUnselectedOutlined } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDeviceContext, usePDFViewerContext } from 'src/context';

export const DrawModeButton: React.FC = () => {
    const { t } = useTranslation();
    const { setDrawMode, controlsDisabled } = usePDFViewerContext();
    const isMobile = useDeviceContext();
    const color = isMobile ? 'default' : 'secondary';
    const handleClick = (): void => setDrawMode(true);

    return (
        <Tooltip title={t('tooltips:markArea')}>
            <span>
                <IconButton onClick={handleClick} size="small" color={color} disabled={controlsDisabled}>
                    <TabUnselectedOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );
};

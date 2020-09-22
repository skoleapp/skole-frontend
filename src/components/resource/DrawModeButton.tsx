import { IconButton, Tooltip } from '@material-ui/core';
import { TabUnselectedOutlined } from '@material-ui/icons';
import { usePDFViewerContext } from 'context';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';

export const DrawModeButton: React.FC = () => {
    const { t } = useTranslation();
    const { isMobileOrTablet } = useMediaQueries();
    const { setDrawMode, controlsDisabled } = usePDFViewerContext();
    const color = isMobileOrTablet ? 'default' : 'secondary';
    const handleClick = (): void => setDrawMode(true);

    return (
        <Tooltip title={t('tooltips:markArea')}>
            <span>
                <IconButton onClick={handleClick} disabled={controlsDisabled} size="small" color={color}>
                    <TabUnselectedOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );
};

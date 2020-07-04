import { IconButton, IconButtonProps, Tooltip } from '@material-ui/core';
import { TabUnselectedOutlined } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDeviceContext } from 'src/context';

export const DrawModeButton: React.FC<IconButtonProps> = props => {
    const { t } = useTranslation();
    const isMobile = useDeviceContext();
    const color = isMobile ? 'default' : 'secondary';

    return (
        <Tooltip title={t('tooltips:markArea')}>
            <span>
                <IconButton {...props} size="small" color={color}>
                    <TabUnselectedOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );
};

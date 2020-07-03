import { IconButton, Tooltip } from '@material-ui/core';
import { TabUnselectedOutlined } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDeviceContext } from 'src/context';

interface Props {
    onClick: () => void;
}

export const DrawModeButton: React.FC<Props> = ({ onClick }) => {
    const { t } = useTranslation();
    const isMobile = useDeviceContext();

    return (
        <Tooltip title={t('tooltips:markArea')}>
            <IconButton onClick={onClick} size="small" color={isMobile ? 'default' : 'secondary'}>
                <TabUnselectedOutlined />
            </IconButton>
        </Tooltip>
    );
};

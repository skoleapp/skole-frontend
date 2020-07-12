import { DrawerProps, IconButton, Tooltip } from '@material-ui/core';
import { InfoOutlined } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useDrawer, useResponsiveIconButtonProps } from '.';

interface UseInfoDrawer extends DrawerProps {
    renderInfoHeader: JSX.Element;
    renderInfoButton: JSX.Element;
}

export const useInfoDrawer = (): UseInfoDrawer => {
    const { t } = useTranslation();
    const iconButtonProps = useResponsiveIconButtonProps();

    const { renderHeader: renderInfoHeader, handleOpen: handleOpenInfo, ...infoDrawerProps } = useDrawer(
        t('common:info'),
    );

    const renderInfoButton = (
        <Tooltip title={t('tooltips:info')}>
            <IconButton onClick={handleOpenInfo} {...iconButtonProps}>
                <InfoOutlined />
            </IconButton>
        </Tooltip>
    );

    return { renderInfoHeader, renderInfoButton, ...infoDrawerProps };
};

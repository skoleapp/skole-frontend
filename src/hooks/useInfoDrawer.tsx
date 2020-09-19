import { DrawerProps, IconButton, Tooltip } from '@material-ui/core';
import { InfoOutlined } from '@material-ui/icons';
import { useTranslation } from 'lib';
import React from 'react';

import { useDrawer } from './useDrawer';
import { useMediaQueries } from './useMediaQueries';

interface UseInfoDrawer extends DrawerProps {
    renderInfoHeader: JSX.Element;
    renderInfoButton: JSX.Element;
}

export const useInfoDrawer = (): UseInfoDrawer => {
    const { t } = useTranslation();
    const { isMobileOrTablet } = useMediaQueries();
    const color = isMobileOrTablet ? 'secondary' : 'default';
    const { renderHeader: renderInfoHeader, handleOpen: handleOpenInfo, ...infoDrawerProps } = useDrawer(
        t('common:info'),
    );

    const renderInfoButton = (
        <Tooltip title={t('tooltips:info')}>
            <IconButton onClick={handleOpenInfo} size="small" color={color}>
                <InfoOutlined />
            </IconButton>
        </Tooltip>
    );

    return { renderInfoHeader, renderInfoButton, ...infoDrawerProps };
};

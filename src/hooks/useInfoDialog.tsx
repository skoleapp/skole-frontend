import { IconButton, Tooltip } from '@material-ui/core';
import { InfoOutlined } from '@material-ui/icons';
import { useTranslation } from 'lib';
import React, { SyntheticEvent } from 'react';
import { DialogHeaderProps } from 'types';

import { useMediaQueries } from './useMediaQueries';
import { useOpen } from './useOpen';

interface UseInfoDrawer {
    infoDialogHeaderProps: DialogHeaderProps;
    infoDialogOpen: boolean;
    renderInfoButton: JSX.Element;
    handleCloseInfoDialog: () => void;
}

export const useInfoDialog = (): UseInfoDrawer => {
    const { t } = useTranslation();
    const { isMobileOrTablet } = useMediaQueries();
    const color = isMobileOrTablet ? 'secondary' : 'default';
    const { open: infoDialogOpen, handleOpen: handleOpenInfoDialog, handleClose: handleCloseInfoDialog } = useOpen();

    const preCloseInfoDialog = (e: SyntheticEvent): void => {
        e.stopPropagation();
        handleCloseInfoDialog();
    };

    const infoDialogHeaderProps = {
        text: t('common:info'),
        onCancel: preCloseInfoDialog,
    };

    const renderInfoButton = (
        <Tooltip title={t('tooltips:info')}>
            <IconButton onClick={handleOpenInfoDialog} size="small" color={color}>
                <InfoOutlined />
            </IconButton>
        </Tooltip>
    );

    return { infoDialogHeaderProps, renderInfoButton, infoDialogOpen, handleCloseInfoDialog };
};

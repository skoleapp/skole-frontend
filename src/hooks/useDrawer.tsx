import { ModalHeader } from 'components';
import { useDeviceContext } from 'context';
import React, { SyntheticEvent } from 'react';
import { UseDrawer } from 'types';

import { useOpen } from '.';

export const useDrawer = (header?: string): UseDrawer => {
    const { open, handleOpen, handleClose } = useOpen();
    const isMobile = useDeviceContext();

    const handleOpenDrawer = (e: SyntheticEvent): void => {
        e.stopPropagation();
        handleOpen();
    };

    const handleCloseDrawer = (e: SyntheticEvent): void => {
        e.stopPropagation();
        handleClose();
    };

    const renderHeader = <ModalHeader text={header} onCancel={handleCloseDrawer} />;

    return {
        open,
        handleOpen: handleOpenDrawer,
        onClose: handleCloseDrawer,
        anchor: isMobile ? 'bottom' : 'left',
        renderHeader,
    };
};

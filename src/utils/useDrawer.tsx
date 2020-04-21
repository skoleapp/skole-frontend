import React, { SyntheticEvent } from 'react';

import { ModalHeader } from '../components';
import { useDeviceContext } from '../context';
import { UseDrawer } from '../types';
import { useOpen } from './useOpen';

export const useDrawer = (): UseDrawer => {
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

    const renderHeader = <ModalHeader onCancel={handleCloseDrawer} />;

    return {
        open,
        handleOpen: handleOpenDrawer,
        onClose: handleCloseDrawer,
        anchor: isMobile ? 'bottom' : 'left',
        renderHeader,
    };
};

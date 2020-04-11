import React, { SyntheticEvent } from 'react';
import { useSelector } from 'react-redux';

import { ModalHeader } from '../components';
import { State, UseDrawer } from '../types';
import { useOpen } from './useOpen';

export const useDrawer = (title?: string): UseDrawer => {
    const { open, handleOpen, handleClose } = useOpen();

    const { isMobile } = useSelector((state: State) => state.ui);

    const handleOpenDrawer = (e: SyntheticEvent): void => {
        e.stopPropagation();
        handleOpen();
    };

    const handleCloseDrawer = (e: SyntheticEvent): void => {
        e.stopPropagation();
        handleClose();
    };

    const renderHeader = <ModalHeader title={title} onCancel={handleCloseDrawer} />;

    return {
        open,
        handleOpen: handleOpenDrawer,
        onClose: handleCloseDrawer,
        anchor: isMobile ? 'bottom' : 'left',
        renderHeader,
    };
};

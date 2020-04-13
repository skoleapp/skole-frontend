import React, { SyntheticEvent } from 'react';

import { ModalHeader } from '../components';
import { breakpointsNum } from '../styles';
import { UseDrawer } from '../types';
import { useBreakPoint } from './useBreakPoint';
import { useOpen } from './useOpen';

export const useDrawer = (header?: string): UseDrawer => {
    const { open, handleOpen, handleClose } = useOpen();
    const isMobile = useBreakPoint(breakpointsNum.MD);

    const handleOpenDrawer = (e: SyntheticEvent): void => {
        e.stopPropagation();
        handleOpen();
    };

    const handleCloseDrawer = (e: SyntheticEvent): void => {
        e.stopPropagation();
        handleClose();
    };

    const renderHeader = <ModalHeader title={header} onCancel={handleCloseDrawer} />;

    return {
        open,
        handleOpen: handleOpenDrawer,
        onClose: handleCloseDrawer,
        anchor: isMobile ? 'bottom' : 'left',
        renderHeader,
    };
};

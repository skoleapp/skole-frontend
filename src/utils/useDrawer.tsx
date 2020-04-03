import React from 'react';

import { ModalHeader } from '../components';
import { breakpointsNum } from '../styles';
import { UseDrawer } from '../types';
import { useBreakPoint } from './useBreakPoint';
import { useOpen } from './useOpen';

export const useDrawer = (title?: string): UseDrawer => {
    const { open, handleOpen, handleClose } = useOpen();
    const isMobile = useBreakPoint(breakpointsNum.MD);
    const renderHeader = <ModalHeader title={title} onCancel={handleClose} />;

    return {
        open,
        handleOpen,
        onClose: handleClose,
        anchor: isMobile ? 'bottom' : 'left',
        renderHeader,
    };
};

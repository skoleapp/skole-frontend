import { ModalHeader } from 'components';
import React, { SyntheticEvent } from 'react';
import { UseDrawer } from 'types';

import { useMediaQueries } from './useMediaQueries';
import { useOpen } from './useOpen';

export const useDrawer = (header?: string): UseDrawer => {
    const { isMobileOrTablet } = useMediaQueries();
    const { open, handleOpen, handleClose } = useOpen();

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
        anchor: isMobileOrTablet ? 'bottom' : 'left',
        renderHeader,
    };
};

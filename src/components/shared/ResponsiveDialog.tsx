import { Dialog, DialogContent, Drawer } from '@material-ui/core';
import { useMediaQueries } from 'hooks';
import React from 'react';
import { DialogHeaderProps } from 'types';

import { DialogHeader } from './DialogHeader';
import { Transition } from './Transition';

interface Props {
    open: boolean;
    onClose: () => void;
    dialogHeaderProps: DialogHeaderProps;
}

// A responsive dialog component, that renders a drawer with anchor in the bottom for mobile devices, and a dialog for desktop devices.
export const ResponsiveDialog: React.FC<Props> = ({ children, dialogHeaderProps, ...dialogProps }) => {
    const { isMobileOrTablet } = useMediaQueries();
    const renderDialogHeader = <DialogHeader {...dialogHeaderProps} />;

    const renderDrawer = (
        <Drawer anchor="bottom" {...dialogProps}>
            {renderDialogHeader}
            {children}
        </Drawer>
    );

    const renderDialog = (
        <Dialog fullWidth TransitionComponent={Transition} {...dialogProps}>
            {renderDialogHeader}
            <DialogContent>{children}</DialogContent>
        </Dialog>
    );

    return isMobileOrTablet ? renderDrawer : renderDialog;
};

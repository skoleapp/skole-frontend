import { DialogContent, Drawer } from '@material-ui/core';
import { useMediaQueries } from 'hooks';
import React, { SyntheticEvent } from 'react';
import { DialogHeaderProps } from 'types';

import { DialogHeader } from './DialogHeader';
import { SkoleDialog } from './SkoleDialog';

interface Props {
    open: boolean;
    onClose: (e: SyntheticEvent) => void;
    dialogHeaderProps: DialogHeaderProps;
}

// A responsive dialog component, that renders a drawer with anchor in the bottom for mobile devices, and a dialog for desktop devices.
export const ResponsiveDialog: React.FC<Props> = ({ children, dialogHeaderProps, ...dialogProps }) => {
    const { isMobileOrTablet } = useMediaQueries();
    const renderDialogHeader = <DialogHeader {...dialogHeaderProps} />;
    const renderDialogContent = <DialogContent>{children}</DialogContent>;

    const renderDrawer = (
        <Drawer anchor="bottom" {...dialogProps}>
            {renderDialogHeader}
            {children}
        </Drawer>
    );

    const renderDialog = (
        <SkoleDialog {...dialogProps}>
            {renderDialogHeader}
            {renderDialogContent}
        </SkoleDialog>
    );

    return isMobileOrTablet ? renderDrawer : renderDialog;
};

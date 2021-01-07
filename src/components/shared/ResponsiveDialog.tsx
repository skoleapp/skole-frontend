import { DialogContent, Drawer, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { useMediaQueries } from 'hooks';
import React, { SyntheticEvent } from 'react';
import { DialogHeaderProps, SkoleDialogProps } from 'types';

import { DialogHeader } from './DialogHeader';
import { SkoleDialog } from './SkoleDialog';

interface Props extends SkoleDialogProps {
  open: boolean;
  onClose: (e: SyntheticEvent) => void;
  dialogHeaderProps: DialogHeaderProps;
}

const useStyles = makeStyles(({ spacing }) => ({
  listDialogContent: {
    padding: 0,
  },
  dialogContent: {
    padding: spacing(2),
  },
}));

// A responsive wrapper component that renders a drawer for mobile devices and a dialog for desktop devices.
export const ResponsiveDialog: React.FC<Props> = ({
  children,
  dialogHeaderProps,
  ...dialogProps
}) => {
  const { isMobile } = useMediaQueries();
  const classes = useStyles();
  const renderDialogHeader = <DialogHeader {...dialogHeaderProps} />;

  // Disable padding for dialog content of lists.
  const renderDialogContent = (
    <DialogContent
      className={clsx(dialogProps.list ? classes.listDialogContent : classes.dialogContent)}
    >
      {children}
    </DialogContent>
  );

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

  return isMobile ? renderDrawer : renderDialog;
};

import DialogContent from '@material-ui/core/DialogContent';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useMediaQueries } from 'hooks';
import React, { useMemo } from 'react';
import { DialogHeaderProps, SkoleDialogProps } from 'types';

import { DialogHeader } from './DialogHeader';
import { SkoleDialog } from './SkoleDialog';

interface Props extends SkoleDialogProps {
  open: boolean;
  onClose: () => void;
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
  const { smDown } = useMediaQueries();
  const classes = useStyles();

  const renderDialogHeader = useMemo(() => <DialogHeader {...dialogHeaderProps} />, [
    dialogHeaderProps,
  ]);

  // Disable padding for dialog content of lists.
  const renderDialogContent = useMemo(
    () => (
      <DialogContent
        className={clsx(dialogProps.list ? classes.listDialogContent : classes.dialogContent)}
      >
        {children}
      </DialogContent>
    ),
    [children, classes.dialogContent, classes.listDialogContent, dialogProps.list],
  );

  const renderDrawer = useMemo(
    () => (
      <Drawer anchor="bottom" {...dialogProps}>
        {renderDialogHeader}
        {children}
      </Drawer>
    ),
    [children, dialogProps, renderDialogHeader],
  );

  const renderDialog = useMemo(
    () => (
      <SkoleDialog {...dialogProps}>
        {renderDialogHeader}
        {renderDialogContent}
      </SkoleDialog>
    ),
    [dialogProps, renderDialogContent, renderDialogHeader],
  );

  return smDown ? renderDrawer : renderDialog;
};

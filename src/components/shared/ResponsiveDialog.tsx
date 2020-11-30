import { DialogContent, Drawer, makeStyles } from '@material-ui/core';
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

const useStyles = makeStyles(({ spacing }) => ({
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

  const renderDialogContent = (
    <DialogContent className={classes.dialogContent}>{children}</DialogContent>
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

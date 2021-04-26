import Box from '@material-ui/core/Box';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PhotoLibraryOutlined from '@material-ui/icons/PhotoLibraryOutlined';
import { useDragContext } from 'context';
import { useTranslation } from 'lib';
import React, { DragEvent, useEffect, useMemo } from 'react';

import { SkoleDialog } from './SkoleDialog';

const useStyles = makeStyles({
  fileUploadIcon: {
    width: '6rem',
    height: '6rem',
  },
  fileDropDialog: {
    pointerEvents: 'none',
  },
  fileDropDialogPaper: {
    minWidth: '15rem',
  },
});

interface Props {
  handleFileDrop: (e: DragEvent<HTMLDivElement>) => void;
  title: string;
}

export const FileDropDialog: React.FC<Props> = ({ handleFileDrop, title }) => {
  const { t } = useTranslation();
  const { handleDragOver, handleDragLeave, dragOver } = useDragContext();
  const classes = useStyles();

  useEffect(() => {
    window.addEventListener('dragover', handleDragOver);

    return (): void => {
      window.removeEventListener('dragover', handleDragOver);
    };
  }, [handleDragOver]);

  const renderDropMask = useMemo(
    () =>
      dragOver && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex="1301" // A magical number to overlap all other dialogs.
          onDragLeave={handleDragLeave}
          onDrop={handleFileDrop}
        />
      ),
    [handleDragLeave, handleFileDrop, dragOver],
  );

  const renderDialog = useMemo(
    () => (
      <SkoleDialog
        open={dragOver}
        fullScreen={false}
        fullWidth={false}
        classes={{
          root: classes.fileDropDialog,
          paper: classes.fileDropDialogPaper,
        }}
      >
        <DialogContent>
          <Box display="flex" justifyContent="center" marginBottom={4}>
            <PhotoLibraryOutlined color="disabled" className={classes.fileUploadIcon} />
          </Box>
          <DialogContentText color="textPrimary">
            <Typography variant="h6" align="center">
              {title}
            </Typography>
          </DialogContentText>
          <DialogContentText>
            <Typography variant="body2" align="center">
              {t('common:releaseToShare')}
            </Typography>
          </DialogContentText>
        </DialogContent>
      </SkoleDialog>
    ),
    [
      classes.fileDropDialog,
      classes.fileDropDialogPaper,
      classes.fileUploadIcon,
      dragOver,
      t,
      title,
    ],
  );

  return (
    <>
      {renderDropMask}
      {renderDialog}
    </>
  );
};

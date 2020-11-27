import { IconButton, Tooltip } from '@material-ui/core';
import { InfoOutlined } from '@material-ui/icons';
import { useTranslation } from 'lib';
import React, { SyntheticEvent } from 'react';
import { DialogHeaderProps } from 'types';
import { useDialogButton } from './useDialogButton';

import { useOpen } from './useOpen';

interface UseInfoDrawer {
  infoDialogHeaderProps: DialogHeaderProps;
  infoDialogOpen: boolean;
  renderInfoButton: JSX.Element;
  handleCloseInfoDialog: (e: SyntheticEvent) => void;
}

export const useInfoDialog = (): UseInfoDrawer => {
  const { t } = useTranslation();
  const dialogButtonProps = useDialogButton();

  const {
    open: infoDialogOpen,
    handleOpen: handleOpenInfoDialog,
    handleClose: _handleCloseInfoDialog,
  } = useOpen();

  const handleCloseInfoDialog = (e: SyntheticEvent): void => {
    e.stopPropagation();
    _handleCloseInfoDialog();
  };

  const infoDialogHeaderProps = {
    text: t('common:info'),
    onCancel: handleCloseInfoDialog,
  };

  const renderInfoButton = (
    <Tooltip title={t('tooltips:info')}>
      <IconButton {...dialogButtonProps} onClick={handleOpenInfoDialog}>
        <InfoOutlined />
      </IconButton>
    </Tooltip>
  );

  return {
    infoDialogHeaderProps,
    renderInfoButton,
    infoDialogOpen,
    handleCloseInfoDialog,
  };
};

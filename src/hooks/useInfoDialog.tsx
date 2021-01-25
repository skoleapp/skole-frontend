import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import React, { SyntheticEvent } from 'react';
import { DialogHeaderProps } from 'types';

import { Emoji } from '../components/shared/Emoji'; // TODO: Transform this hook to a component to mitigate circular import here.import React, { SyntheticEvent } from 'react';
import { useDialogButton } from './useDialogButton';
import { useOpen } from './useOpen';

interface UseInfoDialogParams {
  header: JSX.Element | string;
  emoji?: string | false;
  infoButtonTooltip: string;
}

interface UseInfoDrawer {
  infoDialogHeaderProps: DialogHeaderProps;
  infoDialogOpen: boolean;
  renderInfoButton: JSX.Element;
  handleCloseInfoDialog: (e: SyntheticEvent) => void;
}

export const useInfoDialog = ({
  header,
  emoji,
  infoButtonTooltip,
}: UseInfoDialogParams): UseInfoDrawer => {
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

  const renderEmoji = !!emoji && <Emoji emoji={emoji} />;

  const renderHeader = (
    <>
      {header}
      {renderEmoji}
    </>
  );

  const infoDialogHeaderProps = {
    text: renderHeader,
    onCancel: handleCloseInfoDialog,
  };

  const renderInfoButton = (
    <Tooltip title={infoButtonTooltip}>
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

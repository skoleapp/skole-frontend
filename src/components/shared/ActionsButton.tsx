import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import MoreHorizOutlined from '@material-ui/icons/MoreHorizOutlined';
import { useActionsContext, useMediaQueryContext } from 'context';
import React from 'react';
import { ActionsDialogParams } from 'types';

interface Props extends IconButtonProps {
  tooltip: string;
  actionsDialogParams: ActionsDialogParams;
}

export const ActionsButton: React.FC<Props> = ({ tooltip, actionsDialogParams, ...props }) => {
  const { handleOpenActionsDialog } = useActionsContext();
  const { smDown } = useMediaQueryContext();
  const color = smDown ? 'secondary' : 'default';
  const handleClick = (): void => handleOpenActionsDialog(actionsDialogParams);

  return (
    <Tooltip title={tooltip}>
      <IconButton onClick={handleClick} color={color} size="small" {...props}>
        <MoreHorizOutlined />
      </IconButton>
    </Tooltip>
  );
};

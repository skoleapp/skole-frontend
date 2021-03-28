import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import { useInfoContext } from 'context';
import { useMediaQueries } from 'hooks';
import React from 'react';
import { InfoDialogParams } from 'types';

interface Props {
  tooltip: string;
  infoDialogParams: InfoDialogParams;
}

export const InfoButton: React.FC<Props> = ({ tooltip, infoDialogParams }) => {
  const { handleOpenInfoDialog } = useInfoContext();
  const { smDown } = useMediaQueries();
  const color = smDown ? 'secondary' : 'default';
  const handleClick = (): void => handleOpenInfoDialog(infoDialogParams);

  return (
    <Tooltip title={tooltip}>
      <IconButton onClick={handleClick} color={color} size="small">
        <InfoOutlined />
      </IconButton>
    </Tooltip>
  );
};

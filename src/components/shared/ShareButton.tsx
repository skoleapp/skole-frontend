import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import { useShareContext } from 'context';
import { useMediaQueries } from 'hooks';
import React from 'react';
import { ShareDialogParams } from 'types';

interface Props {
  tooltip: string;
  shareDialogParams: ShareDialogParams;
}

export const ShareButton: React.FC<Props> = ({ tooltip, shareDialogParams }) => {
  const { isMobile } = useMediaQueries();
  const { handleOpenShareDialog } = useShareContext();
  const color = isMobile ? 'secondary' : 'default';
  const handleClick = () => handleOpenShareDialog(shareDialogParams);

  return (
    <Tooltip title={tooltip}>
      <IconButton onClick={handleClick} size="small" color={color}>
        <ShareOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
};

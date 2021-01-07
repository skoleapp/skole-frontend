import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import { useShareContext } from 'context';
import { useMediaQueries } from 'hooks';
import React from 'react';
import { ShareParams } from 'types';

interface Props extends ShareParams {
  tooltip: string;
}

export const ShareButton: React.FC<Props> = ({ tooltip, ...props }) => {
  const { isMobile } = useMediaQueries();
  const { handleOpenShareDialog } = useShareContext();
  const color = isMobile ? 'secondary' : 'default';
  const handleClick = () => handleOpenShareDialog(props);

  return (
    <Tooltip title={tooltip}>
      <IconButton onClick={handleClick} size="small" color={color}>
        <ShareOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
};

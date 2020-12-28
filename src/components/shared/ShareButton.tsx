import { IconButton, Tooltip } from '@material-ui/core';
import { ShareOutlined } from '@material-ui/icons';
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
        <ShareOutlined />
      </IconButton>
    </Tooltip>
  );
};

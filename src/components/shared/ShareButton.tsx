import { IconButton, Tooltip } from '@material-ui/core';
import { ShareOutlined } from '@material-ui/icons';
import { useShareContext } from 'context';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';
import { ShareParams } from 'types';

export const ShareButton: React.FC<ShareParams> = (props) => {
  const { t } = useTranslation();
  const { isMobile } = useMediaQueries();
  const { handleOpenShareDialog } = useShareContext();
  const color = isMobile ? 'secondary' : 'default';
  const handleClick = () => handleOpenShareDialog(props);

  return (
    <Tooltip title={t('tooltips:share')}>
      <IconButton onClick={handleClick} size="small" color={color}>
        <ShareOutlined />
      </IconButton>
    </Tooltip>
  );
};

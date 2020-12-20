import { IconButton, Tooltip } from '@material-ui/core';
import { ShareOutlined } from '@material-ui/icons';
import { useShareContext } from 'context';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'next-translate';
import React from 'react';
import { ShareParams } from 'types';

interface Props extends ShareParams {
  target: string;
}

export const ShareButton: React.FC<Props> = ({ target, ...props }) => {
  const { t } = useTranslation();
  const { isMobile } = useMediaQueries();
  const { handleOpenShareDialog } = useShareContext();
  const color = isMobile ? 'secondary' : 'default';
  const handleClick = () => handleOpenShareDialog(props);

  return (
    <Tooltip title={t('tooltips:share', { target })}>
      <IconButton onClick={handleClick} size="small" color={color}>
        <ShareOutlined />
      </IconButton>
    </Tooltip>
  );
};

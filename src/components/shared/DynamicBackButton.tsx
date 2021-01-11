import { ButtonProps, IconButton, Tooltip } from '@material-ui/core';
import { ArrowBackOutlined } from '@material-ui/icons';
import Router from 'next/router';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';

export const DynamicBackButton: React.FC<ButtonProps> = (props) => {
  const { t } = useTranslation();
  const { isMobile } = useMediaQueries();
  const color = isMobile ? 'secondary' : 'default';

  return (
    <Tooltip title={t('common-tooltips:goBack')}>
      <IconButton {...props} onClick={() => Router.back()} size="small" color={color}>
        <ArrowBackOutlined />
      </IconButton>
    </Tooltip>
  );
};

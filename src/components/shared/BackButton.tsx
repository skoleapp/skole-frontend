import { ButtonProps, IconButton, Tooltip } from '@material-ui/core';
import { ArrowBackOutlined } from '@material-ui/icons';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import Link from 'next/link';
import React from 'react';
import { UrlObject } from 'url';
import { urls } from 'utils';

interface Props extends Omit<ButtonProps, 'href'> {
  href?: string | UrlObject;
  tooltip?: string | false;
}

export const BackButton: React.FC<Props> = ({ href, tooltip, ...props }) => {
  const { isMobile } = useMediaQueries();
  const { t } = useTranslation();
  const color = isMobile ? 'secondary' : 'default';

  return (
    <Link href={href || urls.home}>
      <Tooltip title={tooltip || t('common-tooltips:backToHome')}>
        <IconButton {...props} size="small" color={color}>
          <ArrowBackOutlined />
        </IconButton>
      </Tooltip>
    </Link>
  );
};

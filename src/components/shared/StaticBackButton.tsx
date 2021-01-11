import { ButtonProps, IconButton, Tooltip } from '@material-ui/core';
import { ArrowBackOutlined } from '@material-ui/icons';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import Link from 'next/link';
import React from 'react';
import { UrlObject } from 'url';

interface Props extends Omit<ButtonProps, 'href'> {
  tooltip?: string;
  href: string | UrlObject;
}

export const StaticBackButton: React.FC<Props> = ({ tooltip, href, ...props }) => {
  const { isMobile } = useMediaQueries();
  const { t } = useTranslation();
  const color = isMobile ? 'secondary' : 'default';

  return (
    <Link href={href}>
      <Tooltip title={tooltip || t('common-tooltips:goBack')}>
        <IconButton {...props} size="small" color={color}>
          <ArrowBackOutlined />
        </IconButton>
      </Tooltip>
    </Link>
  );
};

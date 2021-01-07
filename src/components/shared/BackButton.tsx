import { ButtonProps, IconButton, Tooltip } from '@material-ui/core';
import { ArrowBackOutlined } from '@material-ui/icons';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'next-translate';
import Link from 'next/link';
import React from 'react';
import { UrlObject } from 'url';

interface Props extends Omit<ButtonProps, 'href'> {
  tooltip?: string;
  href?: string | UrlObject;
  onClick?: () => void;
}

export const BackButton: React.FC<Props> = ({ tooltip, href, onClick, ...props }) => {
  const { t } = useTranslation();
  const { isMobile } = useMediaQueries();
  const color = isMobile ? 'secondary' : 'default';

  return (
    <Link href={href || '#'}>
      <Tooltip title={tooltip || t('common-tooltips:goBack')}>
        <IconButton {...props} onClick={onClick} size="small" color={color}>
          <ArrowBackOutlined />
        </IconButton>
      </Tooltip>
    </Link>
  );
};

import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import ArrowBackOutlined from '@material-ui/icons/ArrowBackOutlined';
import { useHistoryContext } from 'context';
import { useMediaQueries } from 'hooks';
import Router from 'next/router';
import React from 'react';
import { urls } from 'utils';

export const BackButton: React.FC<IconButtonProps> = (props) => {
  const { isMobile } = useMediaQueries();
  const { history } = useHistoryContext();
  const color = isMobile ? 'secondary' : 'default';

  // If the visitor comes via an external link, redirect to landing page.
  // Otherwise trigger the back button of the browser.
  const handleClick = (): void => {
    if (
      !!process.env.FRONTEND_URL &&
      history.length > 1 &&
      history[history.length - 1].includes(process.env.FRONTEND_URL)
    ) {
      Router.back();
    } else {
      Router.push(urls.index);
    }
  };

  return (
    <IconButton onClick={handleClick} size="small" color={color} {...props}>
      <ArrowBackOutlined />
    </IconButton>
  );
};

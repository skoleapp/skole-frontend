import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import ArrowBackOutlined from '@material-ui/icons/ArrowBackOutlined';
import { useHistoryContext } from 'context';
import { useMediaQueries } from 'hooks';
import Router from 'next/router';
import React from 'react';
import { urls } from 'utils';

// TODO: Implement a history context to detect when we navigate within the app and when the user comes from an external link.
// When the user comes via an external link, we probably want to hard code this button to navigate to the home page etc. instead of acting like the browsers back button.
export const BackButton: React.FC<IconButtonProps> = (props) => {
  const { isMobile } = useMediaQueries();
  const { history } = useHistoryContext();
  const color = isMobile ? 'secondary' : 'default';
  const { FRONTEND_URL } = process.env;

  // If the visitor comes via an external link, redirect to landing page.
  // Otherwise trigger the back button of the browser.
  const handleClick = () => {
    if (
      !!FRONTEND_URL &&
      history.length > 1 &&
      history[history.length - 1].includes(FRONTEND_URL)
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

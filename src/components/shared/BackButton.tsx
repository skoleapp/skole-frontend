import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import ArrowBackOutlined from '@material-ui/icons/ArrowBackOutlined';
import { useMediaQueries } from 'hooks';
import Router from 'next/router';
import React from 'react';

// TODO: Implement a history context to detect when we navigate within the app and when the user comes from an external link.
// When the user comes via an external link, we probably want to hard code this button to navigate to the home page etc. instead of acting like the browsers back button.
export const BackButton: React.FC<IconButtonProps> = (props) => {
  const { isMobile } = useMediaQueries();
  const color = isMobile ? 'secondary' : 'default';

  return (
    <IconButton onClick={() => Router.back()} size="small" color={color} {...props}>
      <ArrowBackOutlined />
    </IconButton>
  );
};

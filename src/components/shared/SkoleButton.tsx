import Button, { ButtonProps } from '@material-ui/core/Button';
import { useDarkModeContext } from 'context';
import React from 'react';

export const SkoleButton: React.FC<ButtonProps> = (props) => {
  const { darkMode } = useDarkModeContext();
  const color = darkMode ? 'secondary' : 'primary';
  return <Button color={color} {...props} />;
};

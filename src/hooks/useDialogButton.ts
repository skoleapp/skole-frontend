import { Size } from '@material-ui/core';
import { MuiColor } from 'types';
import { useMediaQueries } from './useMediaQueries';

interface UseDialogButton {
  color: MuiColor;
  size: Size;
}

export const useDialogButton = (): UseDialogButton => {
  const { isMobile } = useMediaQueries();
  const color = isMobile ? 'secondary' : 'default';
  const size = 'small';
  return { color, size };
};

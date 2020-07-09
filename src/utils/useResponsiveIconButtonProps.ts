import { Size } from '@material-ui/core';
import { useDeviceContext } from 'src/context';
import { MuiColor } from 'src/types';

interface UseIconButton {
    color: MuiColor;
    size: Size;
}

// A custom hook that can be used as a shortcut to get common props for responsive icon buttons.
export const useResponsiveIconButtonProps = (): UseIconButton => {
    const isMobile = useDeviceContext();
    const color = isMobile ? 'secondary' : 'default';
    const size = isMobile ? 'medium' : 'small';
    return { color, size };
};

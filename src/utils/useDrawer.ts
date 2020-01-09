import { useState } from 'react';

interface UseDrawer {
    open: boolean;
    toggleDrawer: (open: boolean) => () => void;
    closeDrawer: () => void;
}

export const useDrawer = (): UseDrawer => {
    const [open, setOpen] = useState(false);
    const closeDrawer = (): void => setOpen(false);
    const toggleDrawer = (open: boolean) => (): void => setOpen(open);
    return { open, toggleDrawer, closeDrawer };
};

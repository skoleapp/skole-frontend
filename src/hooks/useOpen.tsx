import { useState } from 'react';

interface UseOpen {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

export const useOpen = (): UseOpen => {
  const [open, setOpen] = useState(false);
  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);
  return { open, handleOpen, handleClose };
};

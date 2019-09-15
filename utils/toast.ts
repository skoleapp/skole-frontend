import { toast } from 'react-toastify';

// TODO: Match skole theme with the toasts
const options = {
  position: toast.POSITION.TOP_CENTER
};

interface ToastParams {
  msg: string;
  toastType: string;
}

export const SkoleToast = ({ msg, toastType }: ToastParams): void => {
  switch (toastType) {
    case 'success':
      toast.success(msg, options);
      break;
    case 'error':
      toast.error(msg, options);
      break;
    default:
      toast.info(msg, options);
  }
};

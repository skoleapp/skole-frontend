import { SkoleToast } from './toast';

export const createMessage = (msg: string): void => {
  SkoleToast({
    msg,
    toastType: 'success'
  });
};

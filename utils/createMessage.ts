import { SkoleToast } from './toast';

export const createMessage = (msg: string) => {
  SkoleToast({
    msg,
    toastType: 'success'
  });
};

import { SkoleToast } from './toast';

// eslint-disable-next-line
export const createError = (error: any): void => {
  if (error.username) {
    SkoleToast({
      msg: `Username: ${error.username.join()}`,
      toastType: 'error'
    });
  }

  if (error.email) {
    SkoleToast({
      msg: `Email: ${error.email.join()}`,
      toastType: 'error'
    });
  }

  if (error.password) {
    if (error.password.password) {
      SkoleToast({
        msg: `Password: ${error.password.password.join()}`,
        toastType: 'error'
      });
    }

    if (error.password.confirm_password) {
      SkoleToast({
        msg: `Password: ${error.password.confirm_password.join()}`,
        toastType: 'error'
      });
    }

    if (error.password.non_field_errors) {
      SkoleToast({
        msg: `Password: ${error.password.non_field_errors.join()}`,
        toastType: 'error'
      });
    }
  }

  if (error.non_field_errors) {
    SkoleToast({
      msg: error.non_field_errors.join(),
      toastType: 'error'
    });
  }
};

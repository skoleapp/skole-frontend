import { FormErrors } from '../interfaces';

// eslint-disable-next-line @typescript/no-explicit-any
export const createFormErrors = (errors: any): FormErrors => {
  const formErrors = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
    serverNotFound: ''
  };

  if (errors.detail) {
    formErrors.general = errors.detail;
  }

  if (errors.non_field_errors) {
    formErrors.general = errors.non_field_errors.join();
  }

  if (errors.username) {
    formErrors.username = errors.username.join();
  }

  if (errors.email) {
    formErrors.email = errors.email.join();
  }

  if (errors.password) {
    if (errors.password.password) {
      formErrors.password = errors.password.password.join();
    }

    if (errors.password.confirm_password) {
      formErrors.confirmPassword = errors.password.confirm_password.join();
    }

    if (errors.password.non_field_errors) {
      formErrors.general = errors.password.non_field_errors.join();
    }
  }

  return formErrors;
};

import { Errors } from '../interfaces';

// eslint-disable-next-line
export const createErrors = (error: any): Errors => {
  const errors = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
    serverError: ''
  };

  // 4xx errors
  if (error) {
    if (error.username) {
      errors.username = error.username.join();
    }

    if (error.email) {
      errors.email = error.email.join();
    }

    if (error.password) {
      if (error.password.password) {
        errors.password = error.password.password.join();
      }

      if (error.password.confirm_password) {
        errors.confirmPassword = error.password.confirm_password.join();
      }

      if (error.password.non_field_errors) {
        errors.general = error.password.non_field_errors.join();
      }
    }

    if (error.non_field_errors) {
      errors.general = error.non_field_errors.join();
    }

    if (error.detail) {
      errors.general = error.detail;
    }

    // 5xx errors
    if (error.serverError) {
      errors.serverError = error.serverError;
    }
  }

  return errors;
};

import { Errors } from '../interfaces';

// eslint-disable-next-line
export const createErrors = ({ data, status }: any): Errors => {
  const { error, detail } = data;

  const errors = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
    serverNotFound: ''
  };

  // Server not available
  if (status === 503) {
    errors.serverNotFound = error;
  }

  if (detail) {
    errors.general = detail;
  }

  if (error) {
    if (error.non_field_errors) {
      errors.general = error.non_field_errors.join();
    }

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
  }

  return errors;
};

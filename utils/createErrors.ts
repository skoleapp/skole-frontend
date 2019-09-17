interface Errors {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  general: string;
}

// eslint-disable-next-line
export const createErrors = (error: any): Errors => {
  const errors = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: ''
  };

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

  if (error.serverError) {
    errors.general = error.serverError;
  }

  return errors;
};

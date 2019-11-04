import { FormErrors } from '../interfaces';

const snakeToCamel = (str: string): string =>
  str.replace(/([-_][a-z])/g, group =>
    group
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );

const authForms = {
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
};

const updateUserForm = {
  title: '',
  bio: '',
  language: ''
};

const changePasswordForm = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: ''
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createFormErrors = (errors: any): FormErrors => {
  const formErrors = {
    ...authForms,
    ...updateUserForm,
    ...changePasswordForm,
    general: ''
  };

  if (errors.networkError) {
    formErrors.general = 'Network error.';
  }

  if (errors.length) {
    // eslint-disable-next-line
    errors.map((e: any) => {
      if (e.field) {
        (formErrors as any)[snakeToCamel(e.field)] = e.messages.join(); // eslint-disable-line @typescript-eslint/no-explicit-any
      } else {
        formErrors.general = e.messages.join();
      }
    });
  }

  if (errors.graphQLErrors) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors.graphQLErrors.map((e: any) => {
      formErrors.general = e.message;
    });
  }

  return formErrors;
};

import * as R from 'ramda';
import { FormErrors } from '../interfaces';
import { networkErrorMessage } from './messages';

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
    general: '',
    serverNotFound: ''
  };

  if (!R.isEmpty(errors)) {
    if (errors.networkError) {
      formErrors.general = networkErrorMessage;
    } else if (errors.graphQLErrors && errors.graphQLErrors.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      errors.graphQLErrors.map((e: any) => {
        if (e.field) {
          (formErrors as any)[e.field] = e.message; // eslint-disable-line @typescript-eslint/no-explicit-any
        } else {
          formErrors.general = e.message;
        }
      });
    } else if (errors.length) {
      // eslint-disable-next-line
      errors.map((e: any) => {
        if (e.field) {
          (formErrors as any)[snakeToCamel(e.field)] = e.messages.join(); // eslint-disable-line @typescript-eslint/no-explicit-any
        } else {
          formErrors.general = e.messages.join();
        }
      });
    }
  }

  return formErrors;
};

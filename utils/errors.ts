const R = require('ramda');
import { FormErrors } from '../interfaces';

// eslint-disable-next-line
export const createFormErrors = (errors: any): FormErrors => {
  const formErrors = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
    serverNotFound: ''
  };

  if (!R.isEmpty({ ...errors })) {
    if (errors.networkError && errors.networkError.name === 'ServerError') {
      formErrors.general = errors.message;
    } else if (errors.graphQLErrors && errors.graphQLErrors.length > 0) {
      errors.graphQLErrors.map((e: any) => {
        if (e.field) {
          (formErrors as any)[e.field] = e.message;
        } else {
          formErrors.general = e.message;
        }
      });
    } else {
      errors.map((e: any) => {
        if (e.field) {
          (formErrors as any)[e.field] = e.messages.join();
        } else {
          formErrors.general = e.messages.join();
        }
      });
    }
  }

  return formErrors;
};

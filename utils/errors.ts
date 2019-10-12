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

  if (errors.graphQLErrors) {
    errors.graphQLErrors.map((e: any) => {
      if (e.field) {
        (formErrors as any)[e.field] = e.message;
      } else {
        formErrors.general = e.message;
      }
    });
  }

  return formErrors;
};

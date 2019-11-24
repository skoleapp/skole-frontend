import { useRef } from 'react';
import { FormErrors } from '../interfaces';

const snakeToCamel = (str: string): string => {
  return str.replace(/([-_][a-z])/g, group =>
    group
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createFormErrors = (errors: any): any => {
  let formErrors = {
    general: ''
  };

  if (errors.networkError) {
    formErrors.general = 'Network error.';
  } else if (errors.length) {
    // eslint-disable-next-line
    errors.map((e: any) => {
      if (e.field === '__all__') {
        formErrors.general = e.messages.join();
      } else if (e.field) {
        (formErrors as any)[snakeToCamel(e.field)] = e.messages.join(); // eslint-disable-line @typescript-eslint/no-explicit-any
      } else {
        formErrors.general = e.messages.join();
      }
    });
  } else {
    formErrors.general = 'Encountered unexpected error.';
  }

  return formErrors;
};

export const useForm = () => {
  const ref = useRef<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any

  const onError = (errors: FormErrors) => {
    const formErrors = createFormErrors(errors);
    Object.keys(formErrors).forEach(
      key => ref && ref.current && ref.current.setFieldError(key, (formErrors as any)[key]) // eslint-disable-line @typescript-eslint/no-explicit-any
    );
  };

  const resetForm = () => ref && ref.current && ref.current.resetForm();

  return { ref, onError, resetForm };
};

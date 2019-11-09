const snakeToCamel = (str: string): string =>
  str.replace(/([-_][a-z])/g, group =>
    group
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createFormErrors = (errors: any): any => {
  let formErrors = {
    general: ''
  };

  if (errors.networkError) {
    formErrors.general = 'Network error.';
  }

  if (errors.length) {
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
  }

  return formErrors;
};

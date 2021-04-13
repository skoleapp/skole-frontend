import { TextFieldProps } from '@material-ui/core/TextField';
import { useThreadContext } from 'context';
import { Field, FormikProps, FormikValues } from 'formik';
import React from 'react';
import { useMediaQueries } from 'styles';

import { TextFormField } from '../form-fields';

export const CommentTextField = <T extends FormikValues>(
  props: FormikProps<T> & TextFieldProps,
): JSX.Element => {
  const { mdUp } = useMediaQueries();
  const { formRef } = useThreadContext();

  // On desktop, submit form from enter key and add new line from Shift + Enter.
  const handleKeydown = (e: KeyboardEvent): void => {
    if (mdUp && e.code === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.submitForm();
    }
  };

  return (
    <Field
      name="text"
      component={TextFormField}
      multiline
      rowsMax="10"
      InputProps={{
        onKeyDown: handleKeydown,
      }}
      rows="4"
      autoFocus
      {...props}
    />
  );
};

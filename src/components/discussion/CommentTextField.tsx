import { TextFieldProps } from '@material-ui/core/TextField';
import { useDiscussionContext } from 'context';
import { Field, FormikProps, FormikValues } from 'formik';
import { useMediaQueries } from 'hooks';
import React from 'react';

import { TextFormField } from '../form-fields';

export const CommentTextField = <T extends FormikValues>(
  props: FormikProps<T> & TextFieldProps,
): JSX.Element => {
  const { isTabletOrDesktop } = useMediaQueries();
  const { formRef } = useDiscussionContext();

  // On desktop, submit form from enter key and add new line from Shift + Enter.
  const handleKeydown = (e: KeyboardEvent) => {
    if (isTabletOrDesktop && e.code === 'Enter' && !e.shiftKey) {
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
      {...props}
    />
  );
};

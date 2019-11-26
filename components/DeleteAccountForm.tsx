import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { DeleteAccountFormValues } from '../interfaces';
import { FormSubmitSection } from './FormSubmitSection';
import { StyledForm } from './StyledForm';

export const DeleteAccountForm: React.FC<FormikProps<DeleteAccountFormValues>> = props => (
  <StyledForm>
    <Field
      name="password"
      label="Password"
      placeholder="Password"
      component={TextField}
      fullWidth
      type="password"
    />
    <FormSubmitSection submitButtonText="delete account" {...props} />
  </StyledForm>
);

import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { DeleteAccountFormValues } from '../../interfaces';
import { FormSubmitSection, StyledForm } from '../shared';

interface Props extends FormikProps<DeleteAccountFormValues> {
  t: (value: string) => any;
}

export const DeleteAccountForm: React.FC<Props> = props => {
  const t = props.t;
  return (
    <StyledForm>
      <Field
        name="password"
        label={t('fieldPassword')}
        placeholder={t('fieldPassword')}
        component={TextField}
        fullWidth
        type="password"
      />
      <FormSubmitSection submitButtonText={t('buttonDeleteAccount')} {...props} />
    </StyledForm>
  );
};

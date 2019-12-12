import { Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { FormSubmitSection, StyledForm } from '../shared';
import { PasswordForm } from '../../interfaces';

interface Props extends FormikProps<PasswordForm> {
  t: (value: string) => any;
}

export const ChangePasswordForm: React.FC<Props> = props => {
  const t = props.t;
  return (
    <StyledForm>
      <Field
        placeholder={t('fieldOldPassword')}
        name="oldPassword"
        component={TextField}
        label={t('fieldOldPassword')}
        type="password"
        fullWidth
      />
      <Field
        placeholder={t('fieldNewPassword')}
        name="newPassword"
        component={TextField}
        label={t('fieldNewPassword')}
        type="password"
        fullWidth
      />
      <Field
        placeholder={t('fieldConfirmNewPassword')}
        name="confirmNewPassword"
        component={TextField}
        label={t('fieldConfirmNewPassword')}
        type="password"
        fullWidth
      />
      <FormSubmitSection submitButtonText={t('buttonSave')} {...props} />
    </StyledForm>
  );
};

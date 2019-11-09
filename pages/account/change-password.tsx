import { Button, Typography } from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { NextPage } from 'next';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import * as Yup from 'yup';
import { StyledCard } from '../../components';
import { ChangePasswordForm, Layout } from '../../containers';
import { useChangePasswordMutation } from '../../generated/graphql';
import { PasswordForm } from '../../interfaces';
import { createFormErrors, withPrivate } from '../../utils';

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old password is required.'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters long.')
    .required('New password is required.'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords do not match.')
    .required('Confirm new password is required.')
});

const initialValues = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
  general: ''
};

const ChangePasswordPage: NextPage = () => {
  const [completed, setCompleted] = useState(false);
  const ref = useRef<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCompleted = ({ changePassword }: any): void => {
    if (changePassword.errors) {
      const formErrors = createFormErrors(changePassword.errors);
      Object.keys(formErrors).forEach(
        key => ref.current.setFieldError(key, (formErrors as any)[key]) // eslint-disable-line @typescript-eslint/no-explicit-any
      );
    } else {
      setCompleted(true);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (errors: any): void => {
    const formErrors = createFormErrors(errors);
    Object.keys(formErrors).forEach(
      key => ref.current.setFieldError(key, (formErrors as any)[key]) // eslint-disable-line @typescript-eslint/no-explicit-any
    );
  };

  const [loginMutation] = useChangePasswordMutation({ onCompleted, onError });

  const handleSubmit = async (
    values: PasswordForm,
    actions: FormikActions<PasswordForm>
  ): Promise<void> => {
    const { oldPassword, newPassword } = values;
    await loginMutation({ variables: { oldPassword, newPassword } });
    actions.setSubmitting(false);
  };

  if (completed) {
    return (
      <Layout title="Change Password">
        <StyledCard>
          <Typography variant="h5">Password Changed!</Typography>
          <Link href="/account">
            <Button variant="contained" color="primary">
              Back to Account
            </Button>
          </Link>
        </StyledCard>
      </Layout>
    );
  }

  return (
    <StyledCard>
      <Typography variant="h5">Change Password</Typography>
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        component={ChangePasswordForm}
        validationSchema={validationSchema}
        ref={ref}
      />
    </StyledCard>
  );
};

export default withPrivate(ChangePasswordPage);

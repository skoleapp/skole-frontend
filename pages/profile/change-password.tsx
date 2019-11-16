import { Formik, FormikActions } from 'formik';
import { NextPage } from 'next';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { openNotification } from '../../actions';
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
  const ref = useRef<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCompleted = ({ changePassword }: any): void => {
    if (changePassword.errors) {
      const formErrors = createFormErrors(changePassword.errors);
      Object.keys(formErrors).forEach(
        key => ref.current.setFieldError(key, (formErrors as any)[key]) // eslint-disable-line @typescript-eslint/no-explicit-any
      );
    } else {
      ref.current.resetForm();
      dispatch(openNotification('Password changed!'));
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

  return (
    <Layout heading="Change Password" title="Change Password" backUrl="/settings">
      <StyledCard>
        <Formik
          onSubmit={handleSubmit}
          initialValues={initialValues}
          component={ChangePasswordForm}
          validationSchema={validationSchema}
          ref={ref}
        />
      </StyledCard>
    </Layout>
  );
};

export default withPrivate(ChangePasswordPage);

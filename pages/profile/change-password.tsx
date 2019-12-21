import { CardHeader } from '@material-ui/core';
import { Field, Formik, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { openNotification } from '../../actions';
import {
  FormSubmitSection,
  Layout,
  SlimCardContent,
  StyledCard,
  StyledForm
} from '../../components';
import { useChangePasswordMutation } from '../../generated/graphql';
import { FormCompleted, PasswordForm, SkoleContext } from '../../interfaces';
import { useForm, usePrivatePage } from '../../utils';

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
  const { ref, resetForm, setSubmitting, onError } = useForm();
  const dispatch = useDispatch();
  const router = useRouter();

  const onCompleted = async ({ changePassword }: FormCompleted): Promise<void> => {
    if (changePassword.errors) {
      onError(changePassword.errors);
    } else {
      resetForm();
      dispatch(openNotification('Password changed!'));
      await router.push('/profile');
    }
  };

  const [changePasswordMutation] = useChangePasswordMutation({ onCompleted, onError });

  const handleSubmit = async (values: PasswordForm): Promise<void> => {
    const { oldPassword, newPassword } = values;
    await changePasswordMutation({ variables: { oldPassword, newPassword } });
    setSubmitting(false);
  };

  const renderForm = (props: FormikProps<PasswordForm>) => (
    <StyledForm>
      <Field
        placeholder="Old Password"
        name="oldPassword"
        component={TextField}
        label="Old Password"
        type="password"
        fullWidth
      />
      <Field
        placeholder="New Password"
        name="newPassword"
        component={TextField}
        label="New Password"
        type="password"
        fullWidth
      />
      <Field
        placeholder="Confirm New Passsword"
        name="confirmNewPassword"
        component={TextField}
        label="Confirm New Password"
        type="password"
        fullWidth
      />
      <FormSubmitSection submitButtonText="save" {...props} />
    </StyledForm>
  );

  return (
    <Layout title="Change Password" backUrl>
      <StyledCard>
        <CardHeader title="Change Password" />
        <SlimCardContent>
          <Formik
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
            ref={ref}
          >
            {renderForm}
          </Formik>
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

ChangePasswordPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await usePrivatePage(ctx);
  return {};
};

export default ChangePasswordPage;

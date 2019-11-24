import { CardContent, CardHeader } from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { openNotification } from '../../actions';
import { ChangePasswordForm, Layout, StyledCard } from '../../components';
import { useChangePasswordMutation } from '../../generated/graphql';
import { FormCompleted, PasswordForm, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
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
  const { ref, onError } = useForm();
  const dispatch = useDispatch();
  const router = useRouter();

  const onCompleted = ({ changePassword }: FormCompleted): void => {
    if (changePassword.errors) {
      onError(changePassword.errors);
    } else {
      dispatch(openNotification('Password changed!'));
      router.push('/profile');
    }
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
    <Layout title="Change Password" backUrl="/settings">
      <StyledCard>
        <CardHeader title="Change Password" />
        <CardContent>
          <Formik
            onSubmit={handleSubmit}
            initialValues={initialValues}
            component={ChangePasswordForm}
            validationSchema={validationSchema}
            ref={ref}
          />
        </CardContent>
      </StyledCard>
    </Layout>
  );
};

ChangePasswordPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await usePrivatePage(ctx);
  return {};
};

export default compose(withApollo, withRedux)(ChangePasswordPage);

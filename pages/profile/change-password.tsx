import React from 'react';
import { CardHeader, TextField } from '@material-ui/core';
import { Formik, Field } from 'formik';
import { NextPage } from 'next';
import { Router } from '../../i18n';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { openNotification } from '../../actions';
import {
  ChangePasswordForm,
  Layout,
  SlimCardContent,
  StyledCard,
  StyledForm,
  FormSubmitSection
} from '../../components';
import { useChangePasswordMutation } from '../../generated/graphql';
import { FormCompleted, PasswordForm, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { useForm, usePrivatePage } from '../../utils';
import { withTranslation } from '../../i18n';

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

const ChangePasswordPage: NextPage = ({ t }: any) => {
  const { ref, resetForm, setSubmitting, onError } = useForm();
  const dispatch = useDispatch();

  const onCompleted = async ({ changePassword }: FormCompleted): Promise<void> => {
    if (changePassword.errors) {
      onError(changePassword.errors);
    } else {
      resetForm();
      dispatch(openNotification('Password changed!'));
      await Router.push('/profile');
    }
  };

  const [loginMutation] = useChangePasswordMutation({ onCompleted, onError });

  const handleSubmit = async (values: PasswordForm): Promise<void> => {
    const { oldPassword, newPassword } = values;
    await loginMutation({ variables: { oldPassword, newPassword } });
    setSubmitting(false);
  };

  return (
    <Layout t={t} title={t('titleChangePassword')} backUrl="/settings">
      <StyledCard>
        <CardHeader title={t('headerChangePassword')} />
        <SlimCardContent>
          <Formik
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
            ref={ref}
          >
            {props => (
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
            )}
          </Formik>
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

ChangePasswordPage.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
  await usePrivatePage(ctx);
  return { namespacesRequired: ['common'] };
};

export default compose(withRedux, withApollo, withTranslation('common'))(ChangePasswordPage);

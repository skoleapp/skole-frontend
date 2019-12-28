import { CardHeader } from '@material-ui/core';
import { Field, Formik, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { useChangePasswordMutation } from '../../../generated/graphql';
import { openNotification } from '../../actions';
import {
  FormSubmitSection,
  Layout,
  SlimCardContent,
  StyledCard,
  StyledForm
} from '../../components';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { FormCompleted, I18nPage, I18nProps, PasswordForm, SkoleContext } from '../../types';
import { useForm, usePrivatePage } from '../../utils';

const initialValues = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
  general: ''
};

const ChangePasswordPage: I18nPage = () => {
  const { ref, resetForm, setSubmitting, onError } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required(t('validation:oldPasswordRequired')),
    newPassword: Yup.string()
      .min(6, t('validation:passwordTooShort'))
      .required(t('validation:newPasswordRequired')),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], t('validation:passwordsNotMatch'))
      .required(t('validation:confirmPasswordRequired'))
  });

  const onCompleted = async ({ changePassword }: FormCompleted): Promise<void> => {
    if (changePassword.errors) {
      onError(changePassword.errors);
    } else {
      resetForm();
      dispatch(openNotification(t('notifications:passwordChanged')));
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
        placeholder={t('forms:oldPassword')}
        name="oldPassword"
        component={TextField}
        label={t('forms:oldPassword')}
        type="password"
        fullWidth
      />
      <Field
        placeholder={t('forms:newPassword')}
        name="newPassword"
        component={TextField}
        label={t('forms:newPassword')}
        type="password"
        fullWidth
      />
      <Field
        placeholder={t('forms:confirmNewPassword')}
        name="confirmNewPassword"
        component={TextField}
        label={t('forms:confirmNewPassword')}
        type="password"
        fullWidth
      />
      <FormSubmitSection submitButtonText={t('common:save')} {...props} />
    </StyledForm>
  );

  return (
    <Layout title={t('change-password:title')} backUrl>
      <StyledCard>
        <CardHeader title={t('change-password:title')} />
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

ChangePasswordPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
  await usePrivatePage(ctx);

  return {
    namespacesRequired: includeDefaultNamespaces(['change-password'])
  };
};

export default compose(withApollo, withRedux)(ChangePasswordPage);

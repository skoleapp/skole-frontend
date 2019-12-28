import { Box, CardHeader, Divider, FormControl, Link, Typography } from '@material-ui/core';
import { Field, Formik, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { useSignUpMutation } from '../../../generated/graphql';
import { authenticate } from '../../actions';
import {
  ButtonLink,
  FormSubmitSection,
  Layout,
  SlimCardContent,
  StyledCard,
  StyledForm
} from '../../components';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { FormCompleted, I18nPage, I18nProps, SignUpFormValues, SkoleContext } from '../../types';
import { useForm, usePublicPage } from '../../utils';

const initialValues = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  general: ''
};

const SignUpPage: I18nPage = () => {
  const client = useApolloClient();
  const { ref, resetForm, setSubmitting, onError } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required(t('validation:usernameRequired')),
    email: Yup.string()
      .email(t('validation:invalidEmail'))
      .required(t('validation:emailRequired')),
    password: Yup.string()
      .min(6, t('validation:passwordTooShort'))
      .required(t('validation:passwordRequired')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('validation:passwordsNotMatch'))
      .required(t('validation:confirmPasswordRequired'))
  });

  const onCompleted = ({ signUp, signIn }: FormCompleted): void => {
    if (signUp.errors) {
      onError(signUp.errors);
    } else if (signIn.errors) {
      onError(signIn.errors);
    } else {
      resetForm();
      dispatch(authenticate({ client, ...signIn }));
    }
  };

  const [signUpMutation] = useSignUpMutation({ onCompleted, onError });

  const handleSubmit = async (values: SignUpFormValues): Promise<void> => {
    const { username, email, password } = values;
    await signUpMutation({ variables: { username, email, password } });
    setSubmitting(false);
  };

  const renderForm = (props: FormikProps<SignUpFormValues>) => (
    <StyledForm>
      <Field
        placeholder={t('forms:username')}
        name="username"
        component={TextField}
        label={t('forms:username')}
        fullWidth
      />
      <Field
        placeholder={t('forms:email')}
        name="email"
        component={TextField}
        label={t('forms:email')}
        fullWidth
      />
      <Field
        placeholder={t('forms:password')}
        name="password"
        component={TextField}
        label={t('forms:password')}
        type="password"
        fullWidth
      />
      <Field
        placeholder={t('forms:confirmPassword')}
        name="confirmPassword"
        type="password"
        component={TextField}
        label={t('forms:confirmPassword')}
        fullWidth
      />
      <FormControl fullWidth>
        <Box marginTop="0.5rem">
          <Typography variant="body2" color="textSecondary">
            {t('sign-up:termsHelpText')}{' '}
            <Link href="/terms" target="_blank">
              {t('common:terms')}
            </Link>
            .
          </Typography>
        </Box>
      </FormControl>
      <FormSubmitSection submitButtonText={t('common:signUp')} {...props} />
    </StyledForm>
  );

  return (
    <Layout title={t('common:signUp')} backUrl>
      <StyledCard>
        <CardHeader title={t('common:signUp')} />
        <SlimCardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            ref={ref}
          >
            {renderForm}
          </Formik>
          <Box marginTop="1rem">
            <Divider />
          </Box>
          <Box marginY="0.5rem">
            <ButtonLink href="/auth/sign-in" variant="outlined" color="primary" fullWidth>
              {t('sign-up:alreadyHaveAccount')}
            </ButtonLink>
          </Box>
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

SignUpPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
  await usePublicPage(ctx);

  return {
    namespacesRequired: includeDefaultNamespaces(['sign-up'])
  };
};

export default compose(withApollo, withRedux)(SignUpPage);

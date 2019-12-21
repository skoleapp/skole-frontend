import { Box, CardHeader, Divider, FormControl, Link, Typography } from '@material-ui/core';
import { Field, Formik, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { authenticate } from '../../actions';
import {
  FormSubmitSection,
  Layout,
  SlimCardContent,
  StyledCard,
  StyledForm,
  TextLink
} from '../../components';
import { useSignUpMutation } from '../../generated/graphql';
import { includeDefaultNamespaces } from '../../i18n';
import {
  FormCompleted,
  I18nPage,
  I18nProps,
  SignUpFormValues,
  SkoleContext
} from '../../interfaces';
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
    username: Yup.string().required(t('sign-up:usernameRequired')),
    email: Yup.string()
      .email(t('sign-up:invalidEmail'))
      .required(t('sign-up:emailRequired')),
    password: Yup.string()
      .min(6, t('sign-up:passwordTooShort'))
      .required(t('common:passwordRequired')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('sign-up:passwordsNotMatch'))
      .required(t('sign-up:confirmPasswordRequired'))
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
        placeholder={t('common:username')}
        name="username"
        component={TextField}
        label={t('common:username')}
        fullWidth
      />
      <Field
        placeholder={t('common:email')}
        name="email"
        component={TextField}
        label={t('common:email')}
        fullWidth
      />
      <Field
        placeholder={t('common:password')}
        name="password"
        component={TextField}
        label={t('common:password')}
        type="password"
        fullWidth
      />
      <Field
        placeholder={t('common:confirmPassword')}
        name="confirmPassword"
        type="password"
        component={TextField}
        label={t('common:confirmPassword')}
        fullWidth
      />
      <FormControl fullWidth>
        <Box marginTop="0.5rem">
          <Typography variant="body2" color="textSecondary">
            {t('sign-up:bySigninUp')}{' '}
            <Link href="/terms" target="_blank">
              {t('sign-up:terms')}
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
          <Box marginTop="0.5rem">
            <TextLink href="/auth/sign-in">{t('sign-up:alreadyHaveAccount')}</TextLink>
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

export default SignUpPage;

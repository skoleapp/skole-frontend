import { Box, CardHeader, Divider } from '@material-ui/core';
import { Field, Formik, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { authenticate } from '../../actions';
import {
  ButtonLink,
  FormSubmitSection,
  Layout,
  SlimCardContent,
  StyledCard,
  StyledForm,
  TextLink
} from '../../components';
import { useSignInMutation } from '../../generated/graphql';
import { includeDefaultNamespaces, useTranslation } from '../../i18n';
import {
  FormCompleted,
  I18nPage,
  I18nProps,
  SignInFormValues,
  SkoleContext
} from '../../interfaces';
import { useForm, usePublicPage } from '../../utils';

const initialValues = {
  usernameOrEmail: '',
  password: '',
  general: ''
};

const SignInPage: I18nPage = () => {
  const client = useApolloClient();
  const dispatch = useDispatch();
  const { ref, setSubmitting, resetForm, onError } = useForm();
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    usernameOrEmail: Yup.string().required(t('sign-in:usernameOrEmailRequired')),
    password: Yup.string().required(t('common:passwordRequired'))
  });

  const onCompleted = ({ signIn }: FormCompleted): void => {
    if (signIn.errors) {
      onError(signIn.errors);
    } else {
      resetForm();
      dispatch(authenticate({ client, ...signIn }));
    }
  };

  const [signInMutation] = useSignInMutation({ onCompleted, onError });

  const handleSubmit = async (values: SignInFormValues): Promise<void> => {
    const { usernameOrEmail, password } = values;
    await signInMutation({ variables: { usernameOrEmail, password } });
    setSubmitting(false);
  };

  const renderForm = (props: FormikProps<SignInFormValues>) => (
    <StyledForm>
      <Field
        placeholder={t('sign-in:usernameOrEmail')}
        name="usernameOrEmail"
        component={TextField}
        label={t('sign-in:usernameOrEmail')}
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
      <FormSubmitSection submitButtonText={t('common:signIn')} {...props} />
    </StyledForm>
  );

  return (
    <Layout title={t('common:signIn')} backUrl>
      <StyledCard>
        <CardHeader title={t('common:signIn')} />
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
            <ButtonLink href="/auth/sign-up" variant="outlined" color="primary" fullWidth>
              {t('sign-in:createAccount')}
            </ButtonLink>
          </Box>
          <TextLink href="/auth/forgot-password">{t('common:forgotPassword')}</TextLink>
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

SignInPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
  await usePublicPage(ctx);

  return {
    namespacesRequired: includeDefaultNamespaces(['sign-in'])
  };
};

export default SignInPage;

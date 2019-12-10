import { CardHeader, FormControl, Box, Typography } from '@material-ui/core';
import { Formik, Field } from 'formik';
import { NextPage } from 'next';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { clientLogin } from '../../actions';
import {
  Layout,
  SlimCardContent,
  StyledCard,
  TextLink,
  StyledForm,
  FormSubmitSection
} from '../../components';
import { useRegisterMutation } from '../../generated/graphql';
import { FormCompleted, RegisterFormValues, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { useForm, usePublicPage } from '../../utils';
import { withTranslation, Link } from '../../i18n';
import { TextField } from 'formik-material-ui';

const initialValues = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  general: ''
};

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required.'),
  email: Yup.string()
    .email('Invalid email.')
    .required('Email is required.'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters long.')
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match.')
    .required('Please confirm your password.')
});
interface Props {
  t: (value: string) => any;
}
const RegisterPage: NextPage<Props> = ({ t }) => {
  const client = useApolloClient();
  const { ref, resetForm, setSubmitting, onError } = useForm();
  const dispatch = useDispatch();

  const onCompleted = ({ register, login }: FormCompleted): void => {
    if (register.errors) {
      onError(register.errors);
    } else if (login.errors) {
      onError(login.errors);
    } else {
      resetForm();
      dispatch(clientLogin({ client, ...login }));
    }
  };

  const [registerMutation] = useRegisterMutation({ onCompleted, onError });

  const handleSubmit = async (values: RegisterFormValues): Promise<void> => {
    const { username, email, password } = values;
    await registerMutation({ variables: { username, email, password } });
    setSubmitting(false);
  };

  return (
    <Layout t={t} title={t('headerRegister')} backUrl="/">
      <StyledCard>
        <CardHeader title={t('headerRegister')} />
        <SlimCardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            ref={ref}
          >
            {props => (
              <StyledForm>
                <Field
                  placeholder={t('fieldUsername')}
                  name="username"
                  component={TextField}
                  label={t('fieldUsername')}
                  fullWidth
                />
                <Field
                  placeholder={t('example@skole.io')}
                  name="email"
                  component={TextField}
                  label={t('fieldEmail')}
                  fullWidth
                />
                <Field
                  placeholder={t('fieldPassword')}
                  name="password"
                  component={TextField}
                  label={t('fieldPassword')}
                  type="password"
                  fullWidth
                />
                <Field
                  placeholder={t('fieldConfirmPassword')}
                  name="confirmPassword"
                  type="password"
                  component={TextField}
                  label={t('fieldConfirmPassword')}
                  fullWidth
                />
                <FormControl fullWidth>
                  <Box marginTop="0.5rem">
                    <Typography variant="body2" color="textSecondary">
                      {t('textByRegisteringYouAgreeToOur') + ' '}
                      <Link href="/terms">{t('buttonTerms')}</Link>.
                    </Typography>
                  </Box>
                </FormControl>
                <FormSubmitSection submitButtonText={t('buttonRegister')} {...props} />
              </StyledForm>
            )}
          </Formik>
        </SlimCardContent>
        <SlimCardContent>
          <TextLink href="/auth/login">{t('textAlreadyAUser?')}</TextLink>
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

RegisterPage.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
  await usePublicPage(ctx);
  return { namespacesRequired: ['common'] };
};

export default compose(withRedux, withApollo, withTranslation('common'))(RegisterPage);

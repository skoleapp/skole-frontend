import { Box, CardHeader } from '@material-ui/core';
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
import { useLoginMutation } from '../../generated/graphql';
import { FormCompleted, LoginFormValues, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { useForm, usePublicPage } from '../../utils';
import { withTranslation } from '../../i18n';
import { TextField } from 'formik-material-ui';

const initialValues = {
  usernameOrEmail: '',
  password: '',
  general: ''
};

interface Props {
  t: (value: string) => any;
}

const LoginPage: NextPage<Props> = ({ t }) => {
  const client = useApolloClient();
  const dispatch = useDispatch();
  const { ref, setSubmitting, resetForm, onError } = useForm(t);

  const validationSchema = Yup.object().shape({
    usernameOrEmail: Yup.string().required(t('fieldUsernameOrEmailRequired')),
    password: Yup.string().required(t('fieldPasswordRequired'))
  });

  const onCompleted = ({ login }: FormCompleted): void => {
    if (login.errors) {
      onError(login.errors);
    } else {
      resetForm();
      dispatch(clientLogin({ client, ...login }));
    }
  };

  const [loginMutation] = useLoginMutation({ onCompleted, onError });

  const handleSubmit = async (values: LoginFormValues): Promise<void> => {
    const { usernameOrEmail, password } = values;
    await loginMutation({ variables: { usernameOrEmail, password } });
    setSubmitting(false);
  };

  return (
    <Layout t={t} title={t('headerLogin')} backUrl="/">
      <StyledCard>
        <CardHeader title={t('headerLogin')} />
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
                  placeholder={t('example@skole.io')}
                  name={t('fieldUsernameOrEmail')}
                  component={TextField}
                  label={t('fieldUsernameOrEmail')}
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
                <FormSubmitSection submitButtonText={t('buttonRegister')} {...props} />
              </StyledForm>
            )}
          </Formik>
        </SlimCardContent>
        <SlimCardContent>
          <Box>
            <TextLink href="/auth/register">{t('textNewUser?')}</TextLink>
          </Box>
          <Box>
            <TextLink href="/auth/forgot-password">{t('textForgotPassword?')}</TextLink>
          </Box>
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

LoginPage.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
  await usePublicPage(ctx);
  return { namespacesRequired: ['common'] };
};

export default compose(withRedux, withApollo, withTranslation('common'))(LoginPage);

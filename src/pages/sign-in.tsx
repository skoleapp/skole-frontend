import * as Yup from 'yup';

import { Box, CardHeader, Divider } from '@material-ui/core';
import {
    ButtonLink,
    FormSubmitSection,
    Layout,
    SlimCardContent,
    StyledCard,
    StyledForm,
    TextLink,
} from '../components';
import { Field, Formik, FormikProps } from 'formik';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { SignInMutation, useSignInMutation } from '../../generated/graphql';
import { useForm, usePublicPage } from '../utils';
import { withApollo, withRedux } from '../lib';

import React from 'react';
import { TextField } from 'formik-material-ui';
import { authenticate } from '../actions';
import { compose } from 'redux';
import { includeDefaultNamespaces } from '../i18n';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const initialValues = {
    usernameOrEmail: '',
    password: '',
    general: '',
};

export interface SignInFormValues {
    usernameOrEmail: string;
    password: string;
}

const SignInPage: I18nPage = () => {
    const client = useApolloClient();
    const dispatch = useDispatch();
    const { ref, setSubmitting, resetForm, handleMutationErrors, onError } = useForm<SignInFormValues>();
    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        usernameOrEmail: Yup.string().required(t('validation:usernameOrEmailRequired')),
        password: Yup.string().required(t('validation:passwordRequired')),
    });

    const onCompleted = ({ signIn }: SignInMutation): void => {
        if (signIn) {
            if (signIn.errors) {
                handleMutationErrors(signIn.errors);
            } else {
                resetForm();
                dispatch(authenticate(client, signIn));
            }
        }
    };

    const [signInMutation] = useSignInMutation({ onCompleted, onError });

    const handleSubmit = async (values: SignInFormValues): Promise<void> => {
        const { usernameOrEmail, password } = values;
        await signInMutation({ variables: { usernameOrEmail, password } });
        setSubmitting(false);
    };

    const renderForm = (props: FormikProps<SignInFormValues>): JSX.Element => (
        <StyledForm>
            <Field
                placeholder={t('forms:usernameOrEmail')}
                name="usernameOrEmail"
                component={TextField}
                label={t('forms:usernameOrEmail')}
                variant="outlined"
                fullWidth
            />
            <Field
                placeholder={t('forms:password')}
                name="password"
                component={TextField}
                label={t('forms:password')}
                variant="outlined"
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
                    <Box marginTop="0.5rem">
                        <ButtonLink href="/sign-up" variant="outlined" color="primary" fullWidth>
                            {t('sign-in:createAccount')}
                        </ButtonLink>
                    </Box>
                    <Box marginTop="1rem">
                        <TextLink href="/reset-password">{t('sign-in:forgotPassword')}</TextLink>
                    </Box>
                </SlimCardContent>
            </StyledCard>
        </Layout>
    );
};

SignInPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePublicPage(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['sign-in', 'validation', 'forms']) };
};

export default compose(withApollo, withRedux)(SignInPage);

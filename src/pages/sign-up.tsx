import * as Yup from 'yup';

import { Box, Divider, FormControl, Link, Typography } from '@material-ui/core';
import { ButtonLink, FormLayout, FormSubmitSection, StyledForm } from '../components';
import { Field, Formik } from 'formik';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { SignUpMutation, useSignUpMutation } from '../../generated/graphql';
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
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
};

export interface SignUpFormValues {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const SignUpPage: I18nPage = () => {
    const client = useApolloClient();
    const { ref, resetForm, setSubmitting, handleMutationErrors, onError } = useForm<SignUpFormValues>();
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
            .required(t('validation:confirmPasswordRequired')),
    });

    const onCompleted = ({ signUp, signIn }: SignUpMutation): void => {
        if (signUp && signUp.errors) {
            handleMutationErrors(signUp.errors);
        } else if (signIn && signIn.errors) {
            handleMutationErrors(signIn.errors);
        } else if (signIn) {
            resetForm();
            dispatch(authenticate(client, signIn));
        }
    };

    const [signUpMutation] = useSignUpMutation({ onCompleted, onError });

    const handleSubmit = async (values: SignUpFormValues): Promise<void> => {
        const { username, email, password } = values;
        await signUpMutation({ variables: { username, email, password } });
        setSubmitting(false);
    };

    const renderForm = (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} ref={ref}>
            {(props): JSX.Element => (
                <StyledForm>
                    <Field
                        placeholder={t('forms:username')}
                        name="username"
                        component={TextField}
                        label={t('forms:username')}
                        variant="outlined"
                        fullWidth
                    />
                    <Field
                        placeholder={t('forms:email')}
                        name="email"
                        component={TextField}
                        label={t('forms:email')}
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
                    <Field
                        placeholder={t('forms:confirmPassword')}
                        name="confirmPassword"
                        type="password"
                        component={TextField}
                        label={t('forms:confirmPassword')}
                        variant="outlined"
                        fullWidth
                    />
                    <FormControl fullWidth>
                        <Typography variant="body2" color="textSecondary">
                            {t('sign-up:termsHelpText')}{' '}
                            <Link href="/terms" target="_blank">
                                {t('common:terms')}
                            </Link>
                            .
                        </Typography>
                    </FormControl>
                    <FormSubmitSection submitButtonText={t('common:signUp')} {...props} />
                    <Box marginY="1rem">
                        <Divider />
                    </Box>
                    <ButtonLink href="/sign-in" variant="outlined" color="primary" fullWidth>
                        {t('sign-up:alreadyHaveAccount')}
                    </ButtonLink>
                </StyledForm>
            )}
        </Formik>
    );

    return <FormLayout title={t('common:signUp')} renderForm={renderForm} backUrl />;
};

SignUpPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePublicPage(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['sign-up']) };
};

export default compose(withApollo, withRedux)(SignUpPage);

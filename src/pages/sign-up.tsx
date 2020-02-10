import { Box, Divider, FormControl, Link, Typography } from '@material-ui/core';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useTranslation } from '../i18n';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';

import { SignUpMutation, useSignUpMutation } from '../../generated/graphql';
import { authenticate } from '../actions';
import { ButtonLink, FormLayout, FormSubmitSection, StyledForm } from '../components';
import { includeDefaultNamespaces, Router } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useForm, usePublicPage } from '../utils';

const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
    code: '',
};

export interface SignUpFormValues {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    code: string;
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
        code: Yup.string().required(t('validation:betaCodeRequired')),
    });

    const onCompleted = ({ signUp, signIn }: SignUpMutation): void => {
        if (signUp && signUp.errors) {
            handleMutationErrors(signUp.errors);
        } else if (signIn && signIn.errors) {
            handleMutationErrors(signIn.errors);
        } else if (signIn && signIn.user) {
            resetForm();
            dispatch(authenticate(client, signIn));
            Router.push(`/users/${signIn.user.id}`);
        }
    };

    const [signUpMutation] = useSignUpMutation({ onCompleted, onError });

    const handleSubmit = async (values: SignUpFormValues): Promise<void> => {
        const { username, email, password, code } = values;
        // lisää code alempaan mutaatioon
        console.log(code);
        await signUpMutation({ variables: { username, email, password } });
        setSubmitting(false);
    };

    const renderCardContent = (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} ref={ref}>
            {(props): JSX.Element => (
                <StyledForm>
                    <Field
                        placeholder={t('forms:username')}
                        name="username"
                        component={TextField}
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                        type="text"
                    />
                    <Field
                        placeholder={t('forms:email')}
                        name="email"
                        component={TextField}
                        variant="outlined"
                        autoComplete="off"
                        fullWidth
                    />
                    <Field
                        placeholder={t('forms:password')}
                        name="password"
                        component={TextField}
                        variant="outlined"
                        autoComplete="new-password"
                        type="password"
                        fullWidth
                    />
                    <Field
                        placeholder={t('forms:confirmPassword')}
                        name="confirmPassword"
                        type="password"
                        autoComplete="off"
                        component={TextField}
                        variant="outlined"
                        fullWidth
                    />
                    <Field
                        placeholder={t('forms:betaCode')}
                        name="code"
                        autoComplete="off"
                        component={TextField}
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

    return <FormLayout title={t('common:signUp')} renderCardContent={renderCardContent} backUrl />;
};

SignUpPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePublicPage(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['sign-up']) };
};

export default compose(withApollo, withRedux)(SignUpPage);

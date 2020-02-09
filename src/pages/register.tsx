import { Box, Divider, FormControl, Link, Typography } from '@material-ui/core';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';

import { RegisterMutation, useRegisterMutation } from '../../generated/graphql';
import { authenticate } from '../actions';
import { ButtonLink, FormLayout, FormSubmitSection, StyledForm } from '../components';
import { useTranslation } from '../i18n';
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
};

export interface RegisterFormValues {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const RegisterPage: I18nPage = () => {
    const client = useApolloClient();
    const { ref, resetForm, setSubmitting, handleMutationErrors, onError } = useForm<RegisterFormValues>();
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

    const onCompleted = ({ register, login }: RegisterMutation): void => {
        if (register && register.errors) {
            handleMutationErrors(register.errors);
        } else if (login && login.errors) {
            handleMutationErrors(login.errors);
        } else if (login && login.user) {
            resetForm();
            dispatch(authenticate(client, login));
            Router.push(`/users/${login.user.id}`);
        }
    };

    const [registerMutation] = useRegisterMutation({ onCompleted, onError });

    const handleSubmit = async (values: RegisterFormValues): Promise<void> => {
        const { username, email, password } = values;
        await registerMutation({ variables: { username, email, password } });
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
                            {t('register:termsHelpText')}{' '}
                            <Link href="/terms" target="_blank">
                                {t('common:terms')}
                            </Link>
                            .
                        </Typography>
                    </FormControl>
                    <FormSubmitSection submitButtonText={t('common:register')} {...props} />
                    <Box marginY="1rem">
                        <Divider />
                    </Box>
                    <ButtonLink href="/login" variant="outlined" color="primary" fullWidth>
                        {t('register:alreadyHaveAccount')}
                    </ButtonLink>
                </StyledForm>
            )}
        </Formik>
    );

    return <FormLayout title={t('common:register')} renderCardContent={renderCardContent} backUrl />;
};

RegisterPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePublicPage(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['register']) };
};

export default compose(withApollo, withRedux)(RegisterPage);

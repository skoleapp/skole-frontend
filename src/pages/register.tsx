import { Box, Divider, FormControl, Link, Typography } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';

import { RegisterMutation, useRegisterMutation } from '../../generated/graphql';
import { authenticate } from '../actions';
import { ButtonLink, FormLayout, FormSubmitSection } from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces, Router } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useForm, usePublicPage } from '../utils';

export interface RegisterFormValues {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    code: string;
}

const RegisterPage: I18nPage = () => {
    const client = useApolloClient();
    const { ref, resetForm, setSubmitting, handleMutationErrors, onError } = useForm<RegisterFormValues>();
    const dispatch = useDispatch();
    const { query } = useRouter();
    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        username: Yup.string().required(t('validation:required')),
        email: Yup.string()
            .email(t('validation:invalidEmail'))
            .required(t('validation:required')),
        password: Yup.string()
            .min(6, t('validation:passwordTooShort'))
            .required(t('validation:required')),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], t('validation:passwordsNotMatch'))
            .required(t('validation:required')),
        code: Yup.string().required(t('validation:required')),
    });

    const initialValues = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        code: R.propOr('', 'code', query) as string,
        general: '',
    };

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
        const { username, email, password, code } = values;
        await registerMutation({ variables: { username, email, password, code } });
        setSubmitting(false);
    };

    const renderCardContent = (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} ref={ref}>
            {(props): JSX.Element => (
                <Form>
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
                    <Field
                        placeholder={t('forms:betaCode')}
                        name="code"
                        component={TextField}
                        label={t('forms:betaCode')}
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
                </Form>
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

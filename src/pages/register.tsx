import { Box, Divider, FormControl, Typography } from '@material-ui/core';
import { HowToRegOutlined } from '@material-ui/icons';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import * as Yup from 'yup';

import { RegisterMutation, useRegisterMutation, UserObjectType } from '../../generated/graphql';
import { ButtonLink, FormLayout, FormSubmitSection, TextLink } from '../components';
import { useAuthContext } from '../context';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces, Router } from '../i18n';
import { clientLogin } from '../lib';
import { I18nProps } from '../types';
import { useForm, useLanguageSelector } from '../utils';

export interface RegisterFormValues {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    code: string;
}

const RegisterPage: NextPage<I18nProps> = () => {
    const { ref, resetForm, setSubmitting, handleMutationErrors, onError } = useForm<RegisterFormValues>();
    const { query } = useRouter();
    const { t } = useTranslation();
    const { renderLanguageButton } = useLanguageSelector();
    const { setUser } = useAuthContext();

    const validationSchema = Yup.object().shape({
        username: Yup.string().required(t('validation:required')),
        password: Yup.string()
            .min(6, t('validation:passwordTooShort'))
            .required(t('validation:required')),
        email: Yup.string()
            .email(t('validation:invalidEmail'))
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
        if (!!register && !!register.errors) {
            handleMutationErrors(register.errors);
        } else if (!!login && !!login.errors) {
            handleMutationErrors(login.errors);
        } else if (!!login && !!login.token && !!login.user) {
            clientLogin(login.token);
            resetForm();
            setUser(login.user as UserObjectType);
            Router.push('/');
        }
    };

    const [registerMutation] = useRegisterMutation({ onCompleted, onError });

    const handleSubmit = async (values: RegisterFormValues): Promise<void> => {
        const { username, email, password, code } = values;

        await registerMutation({
            variables: { username, email, password, code },
            context: { headers: { Authorization: '' } },
        });

        setSubmitting(false);
    };

    const renderCardContent = (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} ref={ref}>
            {(props): JSX.Element => (
                <Form>
                    <Field
                        placeholder={t('forms:username')}
                        label={t('forms:username')}
                        name="username"
                        component={TextField}
                        variant="outlined"
                        helperText={t('forms:usernameHelperText')}
                        fullWidth
                    />
                    <Field
                        placeholder={t('forms:email')}
                        label={t('forms:email')}
                        name="email"
                        component={TextField}
                        variant="outlined"
                        helperText={t('forms:emailHelperText')}
                        fullWidth
                    />
                    <Field
                        placeholder={t('forms:password')}
                        label={t('forms:password')}
                        name="password"
                        component={TextField}
                        variant="outlined"
                        autoComplete="new-password"
                        type="password"
                        fullWidth
                    />
                    <Field
                        placeholder={t('forms:confirmPassword')}
                        label={t('forms:confirmPassword')}
                        name="confirmPassword"
                        type="password"
                        autoComplete="off"
                        component={TextField}
                        variant="outlined"
                        fullWidth
                    />
                    <Field
                        placeholder={t('forms:betaCode')}
                        label={t('forms:betaCode')}
                        name="code"
                        autoComplete="off"
                        component={TextField}
                        variant="outlined"
                        fullWidth
                        disabled={!!query.code}
                    />
                    <FormControl fullWidth>
                        <Typography variant="body2" color="textSecondary">
                            {t('register:termsHelpText')}{' '}
                            <TextLink href="/terms" target="_blank">
                                {t('common:terms')}
                            </TextLink>
                            .
                        </Typography>
                    </FormControl>
                    <FormSubmitSection submitButtonText={t('common:register')} {...props} />
                    <Box marginY="1rem">
                        <Divider />
                    </Box>
                    <ButtonLink
                        href="/login"
                        variant="outlined"
                        color="primary"
                        endIcon={<HowToRegOutlined />}
                        fullWidth
                    >
                        {t('register:alreadyHaveAccount')}
                    </ButtonLink>
                </Form>
            )}
        </Formik>
    );

    const layoutProps = {
        seoProps: {
            title: t('register:title'),
            description: t('register:description'),
        },
        topNavbarProps: {
            header: t('register:header'),
            headerRight: renderLanguageButton,
        },
        desktopHeader: t('register:header'),
        renderCardContent,
        disableBottomNavbar: true,
    };

    return <FormLayout {...layoutProps} />;
};

export const getServerSideProps: GetServerSideProps = async () => ({
    props: { namespacesRequired: includeDefaultNamespaces(['register']) },
});

export default RegisterPage;

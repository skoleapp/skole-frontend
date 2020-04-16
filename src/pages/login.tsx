import { Box, Divider } from '@material-ui/core';
import { AddCircleOutlineOutlined } from '@material-ui/icons';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import * as Yup from 'yup';

import { LoginMutation, useLoginMutation, UserObjectType } from '../../generated/graphql';
import { ButtonLink, FormLayout, FormSubmitSection } from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces, Router } from '../i18n';
import { useAuth } from '../lib';
import { I18nProps } from '../types';
import { useAlerts, useForm, useLanguageSelector } from '../utils';

const initialValues = {
    username: '',
    password: '',
    general: '',
};

export interface LoginFormValues {
    username: string;
    password: string;
}

const LoginPage: NextPage<I18nProps> = () => {
    const { ref, setSubmitting, resetForm, handleMutationErrors, onError } = useForm<LoginFormValues>();
    const { t } = useTranslation();
    const { query } = useRouter();
    const { renderAlert } = useAlerts();
    const { renderLanguageButton } = useLanguageSelector();
    const { login: loginUser } = useAuth();

    const validationSchema = Yup.object().shape({
        username: Yup.string().required(t('validation:required')),
        password: Yup.string().required(t('validation:required')),
    });

    const onCompleted = async ({ login }: LoginMutation): Promise<void> => {
        if (!!login) {
            if (!!login.errors) {
                handleMutationErrors(login.errors);
            } else if (!!login.token && !!login.user) {
                const { token, user } = login;
                const { next } = query;

                loginUser(token, user as UserObjectType);
                resetForm();

                if (!!next) {
                    Router.push(next as string);
                } else if (user) {
                    Router.push('/');
                }
            }
        }
    };

    const [loginMutation] = useLoginMutation({ onCompleted, onError });

    const handleSubmit = async (values: LoginFormValues): Promise<void> => {
        const { username, password } = values;
        await loginMutation({ variables: { username, password }, context: { headers: { Authorization: '' } } });
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
                        placeholder={t('forms:password')}
                        name="password"
                        component={TextField}
                        label={t('forms:password')}
                        variant="outlined"
                        type="password"
                        fullWidth
                    />
                    <FormSubmitSection submitButtonText={t('common:login')} {...props} />
                    <Box marginY="1rem">
                        <Divider />
                    </Box>
                    <ButtonLink
                        href="/register"
                        variant="outlined"
                        color="primary"
                        endIcon={<AddCircleOutlineOutlined />}
                        fullWidth
                    >
                        {t('login:createAccount')}
                    </ButtonLink>
                    {/* <Box marginTop="1rem"> // TODO: Show this when reset password works.
                        <TextLink href="/contact">{t('login:forgotPassword')}</TextLink>
                    </Box> */}
                </Form>
            )}
        </Formik>
    );

    const layoutProps = {
        seoProps: {
            title: t('login:title'),
            description: t('login:description'),
        },
        topNavbarProps: {
            header: t('login:header'),
            headerRight: renderLanguageButton,
        },
        desktopHeader: t('login:header'),
        renderAlert: (!!query.next && renderAlert('warning', t('alerts:loginRequired'))) || undefined,
        renderCardContent,
        disableBottomNavbar: true,
    };

    return <FormLayout {...layoutProps} />;
};

export const getServerSideProps: GetServerSideProps = async () => ({
    props: { namespacesRequired: includeDefaultNamespaces(['login']) },
});

export default LoginPage;

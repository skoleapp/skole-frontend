import { Box, Divider } from '@material-ui/core';
import { LibraryAddOutlined } from '@material-ui/icons';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import * as Yup from 'yup';

import { LoginMutation, useLoginMutation, UserObjectType } from '../../generated/graphql';
import { ButtonLink, FormLayout, FormSubmitSection, TextLink } from '../components';
import { useAuthContext } from '../context';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces, Router } from '../i18n';
import { clientLogin } from '../lib';
import { I18nProps } from '../types';
import { useAlerts, useForm, useLanguageSelector } from '../utils';

const initialValues = {
    usernameOrEmail: '',
    password: '',
    general: '',
};

export interface LoginFormValues {
    usernameOrEmail: string;
    password: string;
}

const LoginPage: NextPage<I18nProps> = () => {
    const { ref, setSubmitting, resetForm, handleMutationErrors, onError } = useForm<LoginFormValues>();
    const { t } = useTranslation();
    const { query } = useRouter();
    const { renderAlert } = useAlerts();
    const { renderLanguageButton } = useLanguageSelector();
    const { setUser } = useAuthContext();

    const validationSchema = Yup.object().shape({
        usernameOrEmail: Yup.string().required(t('validation:required')),
        password: Yup.string().required(t('validation:required')),
    });

    const onCompleted = async ({ login }: LoginMutation): Promise<void> => {
        if (!!login) {
            if (!!login.errors) {
                handleMutationErrors(login.errors);
            } else if (!!login.token && !!login.user) {
                const { next } = query;
                clientLogin(login.token);
                resetForm();
                setUser(login.user as UserObjectType);

                if (!!next) {
                    Router.push(next as string);
                } else {
                    Router.push('/');
                }
            }
        }
    };

    const [loginMutation] = useLoginMutation({ onCompleted, onError });

    const handleSubmit = async (values: LoginFormValues): Promise<void> => {
        const { usernameOrEmail, password } = values;
        await loginMutation({ variables: { usernameOrEmail, password }, context: { headers: { Authorization: '' } } });
        setSubmitting(false);
    };

    const renderCardContent = (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} ref={ref}>
            {(props): JSX.Element => (
                <Form>
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
                    <FormSubmitSection submitButtonText={t('common:login')} {...props} />
                    <Box marginY="1rem">
                        <Divider />
                    </Box>
                    <ButtonLink
                        href="/register"
                        variant="outlined"
                        color="primary"
                        endIcon={<LibraryAddOutlined />}
                        fullWidth
                    >
                        {t('login:createAccount')}
                    </ButtonLink>
                    <Box marginTop="1rem">
                        <TextLink href="/account/reset-password">{t('login:forgotPassword')}</TextLink>
                    </Box>
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

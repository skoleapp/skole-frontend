import { Box, Divider } from '@material-ui/core';
import { LibraryAddOutlined } from '@material-ui/icons';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { LoginMutation, useLoginMutation, UserObjectType } from '../../generated/graphql';
import { ButtonLink, FormLayout, FormSubmitSection, TextLink } from '../components';
import { useAuthContext, useNotificationsContext } from '../context';
import { includeDefaultNamespaces, Router } from '../i18n';
import { setTokenCookie, withNoAuth, withUserAgent } from '../lib';
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
    const { t } = useTranslation();
    const { query } = useRouter();
    const { renderAlert } = useAlerts();
    const { renderLanguageButton } = useLanguageSelector();
    const { setUser } = useAuthContext();
    const { toggleNotification } = useNotificationsContext();

    const { ref, setSubmitting, resetForm, handleMutationErrors, onError, unexpectedError } = useForm<
        LoginFormValues
    >();

    const validationSchema = Yup.object().shape({
        usernameOrEmail: Yup.string().required(t('validation:required')),
        password: Yup.string().required(t('validation:required')),
    });

    const onCompleted = ({ login }: LoginMutation): void => {
        if (!!login) {
            if (!!login.errors) {
                handleMutationErrors(login.errors);
            } else if (!!login.token && !!login.user && !!login.message) {
                const { next } = query;
                setTokenCookie(login.token);
                resetForm();
                toggleNotification(login.message);
                setUser(login.user as UserObjectType);

                if (!!next) {
                    Router.push(next as string);
                } else {
                    Router.push('/');
                }
            } else {
                unexpectedError();
            }
        } else {
            unexpectedError();
        }
    };

    const [loginMutation] = useLoginMutation({ onCompleted, onError });

    const handleSubmit = async (values: LoginFormValues): Promise<void> => {
        const { usernameOrEmail, password } = values;

        await loginMutation({
            variables: { usernameOrEmail, password },
            context: { headers: { Authorization: '' } },
        });

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
                        autoComplete="off"
                    />
                    <Field
                        placeholder={t('forms:password')}
                        name="password"
                        component={TextField}
                        label={t('forms:password')}
                        variant="outlined"
                        type="password"
                        fullWidth
                        autoComplete="off"
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
    };

    return <FormLayout {...layoutProps} />;
};

const wrappers = R.compose(withUserAgent, withNoAuth);

export const getServerSideProps: GetServerSideProps = wrappers(async () => ({
    props: { namespacesRequired: includeDefaultNamespaces(['login']) },
}));

export default LoginPage;

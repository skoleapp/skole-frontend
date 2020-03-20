import { Box, Divider } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { useRouter } from 'next/router';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';

import { LoginMutation, useLoginMutation } from '../../generated/graphql';
import { authenticate } from '../actions';
import { ButtonLink, FormLayout, FormSubmitSection, TextLink } from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces, Router } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useAlerts, useForm, useLanguageSelector, usePublicPage } from '../utils';

const initialValues = {
    usernameOrEmail: '',
    password: '',
    general: '',
};

export interface LoginFormValues {
    usernameOrEmail: string;
    password: string;
}

const LoginPage: I18nPage = () => {
    const client = useApolloClient();
    const dispatch = useDispatch();
    const { ref, setSubmitting, resetForm, handleMutationErrors, onError } = useForm<LoginFormValues>();
    const { t } = useTranslation();
    const { query } = useRouter();
    const { renderAlert } = useAlerts();
    const { renderLanguageButton } = useLanguageSelector();

    const validationSchema = Yup.object().shape({
        usernameOrEmail: Yup.string().required(t('validation:required')),
        password: Yup.string().required(t('validation:required')),
    });

    const onCompleted = async ({ login }: LoginMutation): Promise<void> => {
        if (login) {
            if (login.errors) {
                handleMutationErrors(login.errors);
            } else {
                resetForm();
                await dispatch(authenticate(client, login));

                const { next } = query;
                const { user } = login;

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
        const { usernameOrEmail, password } = values;
        await loginMutation({ variables: { usernameOrEmail, password } });
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
                    <ButtonLink href="/register" variant="outlined" color="primary" fullWidth>
                        {t('login:createAccount')}
                    </ButtonLink>
                    <Box marginTop="1rem">
                        <TextLink href="/reset-password">{t('login:forgotPassword')}</TextLink>
                    </Box>
                </Form>
            )}
        </Formik>
    );

    return (
        <FormLayout
            title={t('common:login')}
            headerRight={renderLanguageButton}
            renderCardContent={renderCardContent}
            renderAlert={!!query.next ? renderAlert('warning', t('alerts:loginRequired')) : undefined}
            disableBottomNavbar
        />
    );
};

LoginPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePublicPage(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['login']) };
};

export default compose(withApollo, withRedux)(LoginPage);

import { Box, Divider } from '@material-ui/core';
import { LibraryAddOutlined } from '@material-ui/icons';
import { ButtonLink, FormLayout, FormSubmitSection, TextLink } from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { LoginMutation, useLoginMutation, UserObjectType } from 'generated';
import { useAlerts, useForm, useLanguageSelector } from 'hooks';
import { includeDefaultNamespaces, withNoAuth, withUserAgent } from 'lib';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { I18nProps } from 'types';
import { redirect, urls } from 'utils';
import * as Yup from 'yup';

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
    const { setUserMe } = useAuthContext();
    const { toggleNotification } = useNotificationsContext();

    const { ref, setSubmitting, resetForm, handleMutationErrors, onError, unexpectedError } = useForm<
        LoginFormValues
    >();

    const validationSchema = Yup.object().shape({
        usernameOrEmail: Yup.string().required(t('validation:required')),
        password: Yup.string().required(t('validation:required')),
    });

    const onCompleted = async ({ login }: LoginMutation): Promise<void> => {
        if (!!login) {
            if (!!login.errors) {
                handleMutationErrors(login.errors);
            } else if (!!login.user && !!login.message) {
                const { next } = query;

                try {
                    resetForm();
                    toggleNotification(login.message);
                    setUserMe(login.user as UserObjectType);
                    await redirect((next as string) || urls.home);
                } catch {
                    unexpectedError();
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
                        href={urls.register}
                        variant="outlined"
                        color="primary"
                        endIcon={<LibraryAddOutlined />}
                        fullWidth
                    >
                        {t('login:createAccount')}
                    </ButtonLink>
                    <Box marginTop="1rem">
                        <TextLink href={urls.resetPassword}>{t('login:forgotPassword')}</TextLink>
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

export const getServerSideProps: GetServerSideProps = withUserAgent(async () => ({
    props: { namespacesRequired: includeDefaultNamespaces(['login']) },
}));

export default withNoAuth(LoginPage);

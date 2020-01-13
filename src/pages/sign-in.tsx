import * as Yup from 'yup';

import { Box, CardContent, CardHeader, Divider } from '@material-ui/core';
import {
    ButtonLink,
    FormGridContainer,
    FormSubmitSection,
    Layout,
    StyledCard,
    StyledForm,
    TextLink,
} from '../components';
import { Field, Formik, FormikProps } from 'formik';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { Router, includeDefaultNamespaces } from '../i18n';
import { SignInMutation, useSignInMutation } from '../../generated/graphql';
import { useAlerts, useForm, usePublicPage } from '../utils';
import { withApollo, withRedux } from '../lib';

import React from 'react';
import { TextField } from 'formik-material-ui';
import { authenticate } from '../actions';
import { compose } from 'redux';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const initialValues = {
    usernameOrEmail: '',
    password: '',
    general: '',
};

export interface SignInFormValues {
    usernameOrEmail: string;
    password: string;
}

const SignInPage: I18nPage = () => {
    const client = useApolloClient();
    const dispatch = useDispatch();
    const { ref, setSubmitting, resetForm, handleMutationErrors, onError } = useForm<SignInFormValues>();
    const { t } = useTranslation();
    const { query } = useRouter();
    const { renderAlert } = useAlerts();

    const validationSchema = Yup.object().shape({
        usernameOrEmail: Yup.string().required(t('validation:usernameOrEmailRequired')),
        password: Yup.string().required(t('validation:passwordRequired')),
    });

    const onCompleted = async ({ signIn }: SignInMutation): Promise<void> => {
        if (signIn) {
            if (signIn.errors) {
                handleMutationErrors(signIn.errors);
            } else {
                resetForm();
                await dispatch(authenticate(client, signIn));

                const { next } = query;
                const { user } = signIn;

                if (!!next) {
                    Router.push(next as string);
                } else if (user) {
                    Router.push(`/users/${user.id}`);
                }
            }
        }
    };

    const [signInMutation] = useSignInMutation({ onCompleted, onError });

    const handleSubmit = async (values: SignInFormValues): Promise<void> => {
        const { usernameOrEmail, password } = values;
        await signInMutation({ variables: { usernameOrEmail, password } });
        setSubmitting(false);
    };

    const renderForm = (props: FormikProps<SignInFormValues>): JSX.Element => (
        <StyledForm>
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
            <FormSubmitSection submitButtonText={t('common:signIn')} {...props} />
            <Box marginY="1rem">
                <Divider />
            </Box>
            <ButtonLink href="/sign-up" variant="outlined" color="primary" fullWidth>
                {t('sign-in:createAccount')}
            </ButtonLink>
            <Box marginTop="1rem">
                <TextLink href="/reset-password">{t('sign-in:forgotPassword')}</TextLink>
            </Box>
        </StyledForm>
    );

    return (
        <Layout title={t('common:signIn')} backUrl>
            <StyledCard>
                <FormGridContainer>
                    <CardContent>{query.next && renderAlert('warning', t('alerts:signInRequired'))}</CardContent>
                    <CardHeader title={t('common:signIn')} />
                    <CardContent>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                            ref={ref}
                        >
                            {renderForm}
                        </Formik>
                    </CardContent>
                </FormGridContainer>
            </StyledCard>
        </Layout>
    );
};

SignInPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePublicPage(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['sign-in']) };
};

export default compose(withApollo, withRedux)(SignInPage);

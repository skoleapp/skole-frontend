import * as Yup from 'yup';

import { CardContent, CardHeader, FormControl, Grid, InputLabel, MenuItem } from '@material-ui/core';
import { ErrorMessage, Field, Formik, FormikProps } from 'formik';
import { FormErrorMessage, FormSubmitSection, Layout, StyledCard, StyledForm } from '../components';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { Select, TextField } from 'formik-material-ui';
import { useAuthSync, useForm } from '../utils';
import { withApollo, withRedux } from '../lib';

import React from 'react';
import { compose } from 'redux';
import { includeDefaultNamespaces } from '../i18n';
import { openNotification } from '../actions';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const initialValues = {
    contactType: '',
    email: '',
    message: '',
    general: '',
};

export interface ContactFormValues {
    contactType: string;
    email: string;
    message: string;
}

const ContactPage: I18nPage = () => {
    const dispatch = useDispatch();
    const { ref, resetForm } = useForm<ContactFormValues>();
    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        contactType: Yup.string().required(t('validation:contactTypeRequired')),
        email: Yup.string()
            .email(t('validation:invalidEmail'))
            .required(t('validation:emailRequired')),
        message: Yup.string().required(t('validation:messageRequired')),
    });

    // TODO: Finish this.
    const handleSubmit = (values: ContactFormValues): void => {
        console.log(values);
        resetForm();
        dispatch(openNotification(t('notifications:messageSubmitted')));
    };

    const renderForm = (props: FormikProps<ContactFormValues>): JSX.Element => (
        <StyledForm>
            <FormControl fullWidth>
                <InputLabel>{t('forms:contactType')}</InputLabel>
                <Field name="contactType" component={Select} variant="outlined" fullWidth>
                    <MenuItem value="">---</MenuItem>
                    <MenuItem value="feedback">Feedback</MenuItem>
                    <MenuItem value="requestSchool">{t('forms:requestSchool')}</MenuItem>
                    <MenuItem value="requestSubject">{t('forms:requestSubject')}</MenuItem>
                    <MenuItem value="businessInquiry">{t('forms:businessInquiry')}</MenuItem>
                </Field>
                <ErrorMessage name="contactType" component={FormErrorMessage} />
            </FormControl>
            <Field
                name="email"
                component={TextField}
                label={t('forms:email')}
                placeholder={t('forms:email')}
                variant="outlined"
                fullWidth
            />
            <Field
                name="message"
                component={TextField}
                placeholder={t('forms:message')}
                label={t('forms:message')}
                variant="outlined"
                fullWidth
                multiline
            />
            <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
        </StyledForm>
    );

    return (
        <Layout title={t('contact:title')} backUrl>
            <StyledCard>
                <Grid container justify="center">
                    <Grid item xs={12} sm={8} md={6} lg={4}>
                        <CardHeader title={t('contact:title')} />
                        <CardContent>
                            <Formik
                                onSubmit={handleSubmit}
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                ref={ref}
                            >
                                {renderForm}
                            </Formik>
                        </CardContent>
                    </Grid>
                </Grid>
            </StyledCard>
        </Layout>
    );
};

ContactPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['contact']) };
};

export default compose(withApollo, withRedux)(ContactPage);

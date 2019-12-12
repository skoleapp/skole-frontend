import {
  CardHeader,
  FormControl,
  InputLabel,
  TextField,
  Button,
  MenuItem,
  Select
} from '@material-ui/core';
import { Formik, Field, ErrorMessage } from 'formik';
import { NextPage } from 'next';
import React from 'react';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { openNotification } from '../actions';
import { Layout, SlimCardContent, StyledCard, StyledForm, FormErrorMessage } from '../components';
import { ContactFormValues, SkoleContext } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useAuthSync, useForm } from '../utils';
import { withTranslation } from '../i18n';

const initialValues = {
  contactType: '',
  email: '',
  message: '',
  general: ''
};

const validationSchema = Yup.object().shape({
  contactType: Yup.string().required('Contact type is required.'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required.'),
  message: Yup.string().required('Message is required.')
});

const ContactPage: NextPage = ({ t }: any) => {
  const dispatch = useDispatch();
  const { ref, resetForm } = useForm();

  // TODO: Finish this.
  const handleSubmit = (values: ContactFormValues): void => {
    console.log(values);
    resetForm();
    dispatch(openNotification('Message submitted!'));
  };

  return (
    <Layout t={t} title={t('titleContact')} backUrl="/">
      <StyledCard>
        <CardHeader title={t('headerContact')} />
        <SlimCardContent>
          <Formik
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
            ref={ref}
          >
            {() => (
              <StyledForm>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Field name="contactType" component={Select} fullWidth>
                    <MenuItem value="">---</MenuItem>
                    <MenuItem value="feedback">{t('buttonFeedback')}</MenuItem>
                    <MenuItem value="requestSchool">{t('buttonRequestNewSchool')}</MenuItem>
                    <MenuItem value="requestSubject">{t('buttonRequestNewSchool')}</MenuItem>
                    <MenuItem value="businessInquiry">{t('buttonBusinessInquiry')}</MenuItem>
                  </Field>
                  <ErrorMessage name="contactType" component={FormErrorMessage} />
                </FormControl>
                <Field
                  name="email"
                  component={TextField}
                  label={t('fieldEmail')}
                  placeholder={t('example@skole.io')}
                  fullWidth
                />
                <Field
                  name="message"
                  component={TextField}
                  label={t('fieldMessage')}
                  placeholder={t('fieldMessage')}
                  fullWidth
                  multiline
                />
                <Button fullWidth variant="contained" color="primary" type="submit">
                  {t('buttonSubmit')}
                </Button>
              </StyledForm>
            )}
          </Formik>
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

ContactPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return { namespacesRequired: ['common'] };
};

export default compose(withRedux, withApollo, withTranslation('common'))(ContactPage);

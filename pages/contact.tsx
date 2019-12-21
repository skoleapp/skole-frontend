import { CardHeader, FormControl, InputLabel, MenuItem, TextField } from '@material-ui/core';
import { ErrorMessage, Field, Formik, FormikProps } from 'formik';
import { Select } from 'formik-material-ui';
import { NextPage } from 'next';
import React from 'react';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { openNotification } from '../actions';
import {
  FormErrorMessage,
  FormSubmitSection,
  Layout,
  SlimCardContent,
  StyledCard,
  StyledForm
} from '../components';
import { ContactFormValues, SkoleContext } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useAuthSync, useForm } from '../utils';

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

const ContactPage: NextPage = () => {
  const dispatch = useDispatch();
  const { ref, resetForm } = useForm();

  // TODO: Finish this.
  const handleSubmit = (values: ContactFormValues): void => {
    console.log(values);
    resetForm();
    dispatch(openNotification('Message submitted!'));
  };

  const renderForm = (props: FormikProps<ContactFormValues>) => (
    <StyledForm>
      <FormControl fullWidth>
        <InputLabel>Type</InputLabel>
        <Field name="contactType" component={Select} fullWidth>
          <MenuItem value="">---</MenuItem>
          <MenuItem value="feedback">Feedback</MenuItem>
          <MenuItem value="requestSchool">Request New School</MenuItem>
          <MenuItem value="requestSubject">Request New Subject</MenuItem>
          <MenuItem value="businessInquiry">Business Inquiry</MenuItem>
        </Field>
        <ErrorMessage name="contactType" component={FormErrorMessage} />
      </FormControl>
      <Field
        name="email"
        component={TextField}
        label="Email"
        placeholder="example@skole.io"
        fullWidth
      />
      <Field
        name="message"
        component={TextField}
        placeholder="Message"
        label="Message"
        fullWidth
        multiline
      />
      <FormSubmitSection submitButtonText="save" {...props} />
    </StyledForm>
  );

  return (
    <Layout title="Contact" backUrl>
      <StyledCard>
        <CardHeader title="Contact" />
        <SlimCardContent>
          <Formik
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
            ref={ref}
          >
            {renderForm}
          </Formik>
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

ContactPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return {};
};

export default compose(withRedux, withApollo)(ContactPage);

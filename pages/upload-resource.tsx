import { CardHeader } from '@material-ui/core';
import { Formik } from 'formik';
import { NextPage } from 'next';
import { Router } from '../i18n';
import React from 'react';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { openNotification } from '../actions';
import { Layout, SlimCardContent, StyledCard, UploadResourceForm } from '../components';
import { UploadResourceFormDataDocument } from '../generated/graphql';
import { Course, ResourceType, SkoleContext, UploadResourceFormValues } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useAuthSync, useForm } from '../utils';
import { withTranslation } from '../i18n';

const validationSchema = Yup.object().shape({
  resourceTitle: Yup.string().required('Resource title is required.'),
  resourceType: Yup.string().required('Resource type is required.'),
  courseId: Yup.string().required('Course is required.'),
  resource: Yup.string().required('Resource is required.')
});

interface Props {
  resourceTypes?: ResourceType[];
  courses?: Course[];
}

const UploadResourcePage: NextPage<Props> = ({ resourceTypes, courses }) => {
  const dispatch = useDispatch();
  const { ref, setSubmitting, resetForm } = useForm();

  const handleSubmit = async (values: UploadResourceFormValues) => {
    console.log(values);
    setSubmitting(false);
    resetForm();
    dispatch(openNotification('Resource uploaded!'));
    await Router.push('/');
  };

  const initialValues = {
    resourceTitle: '',
    resourceType: '',
    courseId: '',
    resource: '',
    resourceParts: null,
    general: '',
    resourceTypes: resourceTypes || '',
    courses: courses || ''
  };

  return (
    <Layout title="Upload Resource" backUrl="/">
      <StyledCard>
        <CardHeader title="Upload Resource" />
        <SlimCardContent>
          <Formik
            component={UploadResourceForm}
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
            ref={ref}
          />
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

UploadResourcePage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await useAuthSync(ctx);

  try {
    const { data } = await ctx.apolloClient.query({ query: UploadResourceFormDataDocument });
    return { ...data };
  } catch {
    return {};
  }
};

export default compose(withRedux, withApollo, withTranslation('common'))(UploadResourcePage);

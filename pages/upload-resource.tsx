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

interface Props {
  resourceTypes?: ResourceType[];
  courses?: Course[];
  t: (value: string) => any;
}

const UploadResourcePage: NextPage<Props> = ({ resourceTypes, courses, t }) => {
  const dispatch = useDispatch();
  const { ref, setSubmitting, resetForm } = useForm(t);

  const handleSubmit = async (values: UploadResourceFormValues) => {
    console.log(values);
    setSubmitting(false);
    resetForm();
    dispatch(openNotification(t('textResourceUploaded')));
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

  const validationSchema = Yup.object().shape({
    resourceTitle: Yup.string().required(t('fieldResourceTitleRequired')),
    resourceType: Yup.string().required(t('fieldResourceTypeRequired')),
    courseId: Yup.string().required(t('fieldCourseRequired')),
    resource: Yup.string().required(t('fieldResourceRequired'))
  });

  return (
    <Layout t={t} title={t('titleUploadResource')} backUrl="/">
      <StyledCard>
        <CardHeader title={t('headerUploadResource')} />
        <SlimCardContent>
          <Formik
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
            ref={ref}
            render={props => (
              <UploadResourceForm
                {...props}
                resourceTypes={resourceTypes}
                courses={courses}
                t={t}
              />
            )}
          />
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

UploadResourcePage.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
  await useAuthSync(ctx);

  try {
    const { data } = await ctx.apolloClient.query({ query: UploadResourceFormDataDocument });
    return { ...data, namespacesRequired: ['common'] };
  } catch {
    return { namespacesRequired: ['common'] };
  }
};

export default compose(withRedux, withApollo, withTranslation('common'))(UploadResourcePage);

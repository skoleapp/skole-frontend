import Collapse from '@material-ui/core/Collapse';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import {
  AutocompleteField,
  DatePickerFormField,
  Emoji,
  ErrorTemplate,
  FileField,
  FormSubmitSection,
  FormTemplate,
  LoginRequiredTemplate,
  TextFormField,
  TextLink,
} from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import dayjs from 'dayjs';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  AutocompleteCoursesDocument,
  AutocompleteResourceTypesDocument,
  AutocompleteSchoolsDocument,
  CourseObjectType,
  CreateResourceMutation,
  SchoolObjectType,
  useCreateResourceAutocompleteDataQuery,
  useCreateResourceMutation,
} from 'generated';
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext, useOpen } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useEffect } from 'react';
import { ContactDialog } from 'src/components/shared/ContactDialog';
import { GuidelinesLink } from 'src/components/shared/GuidelinesLink';
import { SeoPageProps } from 'types';
import { urls } from 'utils';
import * as Yup from 'yup';

interface UploadResourceFormValues {
  resourceTitle: string;
  resourceType: string | null;
  date: Date | null;
  school: SchoolObjectType | null;
  course: CourseObjectType | null;
  file: File | null;
}

const UploadResourcePage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const { query } = useRouter();
  const { toggleNotification } = useNotificationsContext();
  const { t } = useTranslation();
  const context = useLanguageHeaderContext();
  const variables = R.pick(['school', 'course'], query);
  const { userMe, username, email, school: _school } = useAuthContext();

  const contactDialogProps = useOpen();
  const contactDialogEmailText = t('upload-resource:contactDialogEmailText');
  const contactDialogFormatText = t('upload-resource:contactDialogFormatText');
  const guidelinesInfo = t('upload-resource:guidelinesInfo');

  const {
    formRef,
    onError,
    handleMutationErrors,
    setUnexpectedFormError,
  } = useForm<UploadResourceFormValues>();

  const { data, error } = useCreateResourceAutocompleteDataQuery({
    variables,
    context,
  });

  // Prefill user's own school, if one exists and no other school is provided as a query parameter.
  const school = R.propOr(_school, 'school', data);
  const course = R.propOr(null, 'course', data);

  useEffect(() => {
    formRef.current?.setFieldValue('school', school);
    formRef.current?.setFieldValue('course', course);
  }, [school, course]);

  const validationSchema = Yup.object().shape({
    resourceTitle: Yup.string().required(t('validation:required')),
    resourceType: Yup.object().nullable().required(t('validation:required')),
    date: Yup.date().nullable(),
    school: Yup.object().nullable().required(t('validation:required')),
    course: Yup.object().nullable().required(t('validation:required')),
    file: Yup.mixed().required(t('validation:required')),
  });

  const onCompleted = async ({ createResource }: CreateResourceMutation): Promise<void> => {
    if (createResource) {
      if (!!createResource.errors && !!createResource.errors.length) {
        handleMutationErrors(createResource.errors);
      } else if (
        !!createResource.resource &&
        !!createResource.resource.id &&
        !!createResource.successMessage
      ) {
        formRef.current?.resetForm();
        toggleNotification(createResource.successMessage);
        await Router.push(urls.resource(createResource.resource.id));
      } else {
        setUnexpectedFormError();
      }
    } else {
      setUnexpectedFormError();
    }
  };

  const [createResource] = useCreateResourceMutation({
    onCompleted,
    onError,
    context,
  });

  const handleUpload = async ({
    resourceTitle,
    resourceType: _resourceType,
    date: _date,
    course: _course,
    file,
  }: UploadResourceFormValues): Promise<void> => {
    const resourceType = R.propOr('', 'id', _resourceType);
    const date = _date ? dayjs(_date).format('YYYY-MM-DD') : null; // Only eligible format for GraphQL `Date` scalar.
    const course = R.propOr('', 'id', _course);

    const variables = {
      resourceTitle,
      resourceType,
      date,
      course,
      file,
    };

    formRef.current?.setFieldValue('general', t('upload-resource:fileUploadingText'));

    // @ts-ignore: A string value is expected for the file field, which is incorrect.
    await createResource({ variables });
  };

  const initialValues = {
    resourceTitle: '',
    resourceType: null,
    date: new Date(),
    school,
    course,
    file: null,
    general: '',
  };

  const renderResourceTitleField = (
    <Field
      name="resourceTitle"
      label={t('forms:resourceTitle')}
      component={TextFormField}
      helperText={t('upload-resource:resourceTitleHelperText')}
    />
  );

  const renderResourceTypeField = (
    <Field
      name="resourceType"
      label={t('forms:resourceType')}
      dataKey="autocompleteResourceTypes"
      document={AutocompleteResourceTypesDocument}
      component={AutocompleteField}
      helperText={t('upload-resource:resourceTypeHelperText')}
    />
  );

  const renderDateField = (
    <Field
      name="date"
      label={t('forms:dateOptional')}
      component={DatePickerFormField}
      helperText={t('upload-resource:dateHelperText')}
    />
  );

  const renderSchoolHelperText = (
    <>
      {t('upload-resource:schoolHelperText')}{' '}
      <TextLink href={urls.contact}>{t('upload-resource:schoolHelperLink')}</TextLink>
    </>
  );

  const renderSchoolField = (
    <Field
      name="school"
      label={t('forms:school')}
      dataKey="autocompleteSchools"
      searchKey="name"
      document={AutocompleteSchoolsDocument}
      component={AutocompleteField}
      helperText={renderSchoolHelperText}
    />
  );

  const renderCourseHelperText = (
    <>
      {t('upload-resource:courseHelperText')}{' '}
      <TextLink href={urls.addCourse}>{t('upload-resource:courseHelperLink')}</TextLink>
    </>
  );

  // Only collapse this field in once the school has been selected.
  const renderCourseField = (props: FormikProps<UploadResourceFormValues>) => (
    <Collapse in={!!props.values.school}>
      <Field
        name="course"
        label={t('forms:course')}
        dataKey="autocompleteCourses"
        searchKey="name"
        suffixKey="code"
        document={AutocompleteCoursesDocument}
        component={AutocompleteField}
        variables={{
          school: R.path(['values', 'school', 'id'], props), // Filter courses based on selected school.
        }}
        helperText={renderCourseHelperText}
      />
    </Collapse>
  );

  const renderFileField = <Field name="file" component={FileField} />;

  const renderFormSubmitSection = (props: FormikProps<UploadResourceFormValues>) => (
    <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
  );

  const renderContactLink = (
    <TextLink onClick={contactDialogProps.handleOpen} href="#">
      {t('upload-resource:contactLink')}
    </TextLink>
  );

  const renderContactHelperText = (
    <FormControl>
      <FormHelperText>
        {t('upload-resource:contactText')} {renderContactLink}
      </FormHelperText>
    </FormControl>
  );

  const renderFormFields = (props: FormikProps<UploadResourceFormValues>): JSX.Element => (
    <Form>
      {renderResourceTitleField}
      {renderResourceTypeField}
      {renderDateField}
      {renderSchoolField}
      {renderCourseField(props)}
      {renderFileField}
      {renderFormSubmitSection(props)}
      {renderContactHelperText}
    </Form>
  );

  const renderForm = (
    <Formik
      onSubmit={handleUpload}
      initialValues={initialValues}
      validationSchema={validationSchema}
      innerRef={formRef}
    >
      {renderFormFields}
    </Formik>
  );

  const { EMAIL_ADDRESS } = process.env;

  const authenticatedEmailBody = `
${t('upload-resource:materialEmailInfo')}
${t('common:username')}: ${username}
${t('common:email')}: ${email}`;

  const anonymousEmailBody = `
${t('upload-resource:loginRequiredMaterialEmailInfo')}
${t('common:username')}: ${t('common:usernamePlaceholder')}
${t('common:email')}: ${t('common:emailPlaceholder')}`;

  const emailBody = userMe ? authenticatedEmailBody : anonymousEmailBody;

  const emailHref = `mailto:${EMAIL_ADDRESS}?subject=${t(
    'upload-resource:materialEmailSubject',
  )}&body=${encodeURIComponent(emailBody)}`;

  const renderEmailLink = <TextLink href={emailHref}>{EMAIL_ADDRESS}</TextLink>;
  const renderGuidelinesLink = <GuidelinesLink />;

  const renderCommonDialogEmailText = (
    <>
      {contactDialogEmailText} {renderEmailLink}.
    </>
  );

  const renderCommonMiscDialogText = (
    <>
      {contactDialogFormatText} {guidelinesInfo} {renderGuidelinesLink}.
    </>
  );

  const renderContactDialogText = (
    <>
      {renderCommonDialogEmailText} {t('upload-resource:contactDialogCreditText')}{' '}
      {t('upload-resource:contactDialogAccountText')} {renderCommonMiscDialogText}
    </>
  );

  const renderLoginRequiredContactDialogText = (
    <>
      {renderCommonDialogEmailText} {t('upload-resource:loginRequiredContactDialogCreditText')}{' '}
      {t('upload-resource:contactDialogAccountText')} {renderCommonMiscDialogText}
    </>
  );

  const commonContactDialogProps = {
    ...contactDialogProps,
    header: (
      <>
        {t('upload-resource:contactDialogHeader')}
        <Emoji emoji="💪" />
      </>
    ),
  };

  const renderContactDialog = (
    <ContactDialog {...commonContactDialogProps} text={renderContactDialogText} />
  );

  const renderLoginRequiredContactDialog = (
    <ContactDialog {...commonContactDialogProps} text={renderLoginRequiredContactDialogText} />
  );

  const renderLoginRequiredText = (
    <FormControl>
      <FormHelperText>
        {t('upload-resource:loginRequiredText')} {renderContactLink}
      </FormHelperText>
    </FormControl>
  );

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: t('upload-resource:header'),
    },
  };

  if (!userMe) {
    return (
      <LoginRequiredTemplate {...layoutProps}>
        {renderLoginRequiredText}
        {renderLoginRequiredContactDialog}
      </LoginRequiredTemplate>
    );
  }

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" seoProps={seoProps} />;
  }

  if (error) {
    return <ErrorTemplate variant="error" seoProps={seoProps} />;
  }

  return (
    <FormTemplate {...layoutProps}>
      {renderForm}
      {renderContactDialog}
    </FormTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const t = await getT(locale, 'upload-resource');

  return {
    props: {
      _ns: await loadNamespaces(['upload-resource'], locale),
      seoProps: {
        title: t('title'),
        description: t('description'),
      },
    },
  };
};

export default withUserMe(UploadResourcePage);

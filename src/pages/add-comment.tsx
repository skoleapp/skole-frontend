import FormControl from '@material-ui/core/FormControl';
import {
  AuthorSelection,
  AutocompleteField,
  CommentAttachmentInput,
  CommentTextField,
  CommentTextFieldToolbar,
  FormSubmitSection,
  FormTemplate,
} from 'components';
import { useAuthContext, useDiscussionContext, useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  AutocompleteSchoolsDocument,
  CreateCommentMutation,
  useCreateCommentMutation,
} from 'generated';
import { withDiscussion, withUserMe } from 'hocs';
import { useLanguageHeaderContext } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { CommentAttachmentPreview } from 'src/components/discussion/CommentAttachmentPreview';
import { CreateCommentFormValues, SeoPageProps } from 'types';
import { urls } from 'utils';
import * as Yup from 'yup';

const AddCommentPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const { t } = useTranslation();
  const { userMe, school } = useAuthContext();
  const { toggleNotification, toggleUnexpectedErrorNotification } = useNotificationsContext();
  const context = useLanguageHeaderContext();
  const { setCommentAttachment, formRef } = useDiscussionContext();

  const onCompleted = async ({ createComment }: CreateCommentMutation): Promise<void> => {
    if (createComment) {
      if (!!createComment.errors && !!createComment.errors.length) {
        toggleUnexpectedErrorNotification();
      } else if (!!createComment.successMessage && !!createComment.comment?.school) {
        formRef.current?.resetForm();
        setCommentAttachment(null);
        toggleNotification(createComment.successMessage);

        await Router.push({
          pathname: urls.school(createComment.comment.school.id),
          query: {
            comment: createComment.comment.id,
          },
        });

        sa_event('create_comment');
      } else {
        toggleUnexpectedErrorNotification();
      }
    } else {
      toggleUnexpectedErrorNotification();
    }
  };

  const [createCommentMutation] = useCreateCommentMutation({
    onCompleted,
    onError: toggleUnexpectedErrorNotification,
  });

  // Only used for making TS compiler happy.
  const placeholderTargets = {
    course: null,
    resource: null,
    comment: null,
  };

  const handleSubmit = async ({
    user: _user,
    school: _school,
    ...values
  }: CreateCommentFormValues): Promise<void> => {
    const user = R.prop('id', _user);
    const school = R.prop('id', _school);

    await createCommentMutation({
      variables: { ...values, user, school, ...placeholderTargets },
      context,
    });

    formRef.current?.setSubmitting(false);
  };

  const initialValues = {
    user: userMe,
    text: '',
    attachment: null,
    school,
    ...placeholderTargets,
  };

  const validationSchema = Yup.object().shape({
    school: Yup.object().nullable().required(t('validation:required')),
    attachment: Yup.mixed(),
    text: Yup.string().when('attachment', {
      is: (attachment: string) => !attachment,
      then: Yup.string().required(t('validation:textOrAttachmentRequired')),
      otherwise: Yup.string(),
    }),
  });

  const renderSchoolField = (
    <Field
      name="school"
      label={t('forms:school')}
      dataKey="autocompleteSchools"
      searchKey="name"
      document={AutocompleteSchoolsDocument}
      component={AutocompleteField}
      helperText={t('add-comment:schoolHelperText')}
    />
  );

  const renderAuthorSelection = (props: FormikProps<CreateCommentFormValues>) =>
    !!userMe && (
      <FormControl>
        <AuthorSelection {...props} />
      </FormControl>
    );

  const renderTextFieldToolbar = <CommentTextFieldToolbar />;
  const renderAttachmentPreview = <CommentAttachmentPreview />;
  const renderAttachmentInput = <CommentAttachmentInput />;

  const getPlaceholder = (school: CreateCommentFormValues['school']) =>
    school
      ? t('forms:postTo', {
          target: R.prop('name', school),
        })
      : t('forms:selectSchoolToPost');

  const renderTextField = (props: FormikProps<CreateCommentFormValues>) => (
    <CommentTextField {...props} placeholder={getPlaceholder(props.values.school)} />
  );

  const renderFormSubmitSection = (props: FormikProps<CreateCommentFormValues>) => (
    <FormSubmitSection submitButtonText={t('common:send')} {...props} />
  );

  const renderFormFields = (props: FormikProps<CreateCommentFormValues>) => (
    <Form>
      {renderSchoolField}
      {renderAuthorSelection(props)}
      {renderAttachmentPreview}
      {renderTextFieldToolbar}
      {renderAttachmentInput}
      {renderTextField(props)}
      {renderFormSubmitSection(props)}
    </Form>
  );

  const renderForm = (
    <Formik
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
      innerRef={formRef}
      enableReinitialize
    >
      {renderFormFields}
    </Formik>
  );

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: t('add-comment:header'),
      emoji: '💬',
    },
  };

  return <FormTemplate {...layoutProps}>{renderForm}</FormTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const t = await getT(locale, 'add-comment');

  return {
    props: {
      _ns: await loadNamespaces(['add-comment', 'discussion', 'discussion-tooltips'], locale),
      seoProps: {
        title: t('title'),
        description: t('description'),
      },
    },
  };
};

const withWrappers = R.compose(withDiscussion, withUserMe);

export default withWrappers(AddCommentPage);

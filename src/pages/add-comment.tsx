import { DiscussionsUnion } from '__generated__/src/graphql/common.graphql';
import Collapse from '@material-ui/core/Collapse';
import FormControl from '@material-ui/core/FormControl';
import {
  AuthorSelection,
  AutocompleteField,
  CheckboxFormField,
  CommentAttachmentInput,
  CommentAttachmentPreview,
  CommentTextField,
  CommentTextFieldToolbar,
  FormSubmitSection,
  FormTemplate,
  TextLink,
} from 'components';
import { useAuthContext, useDiscussionContext, useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  AutocompleteDiscussionsDocument,
  CourseObjectType,
  CreateCommentMutation,
  SchoolObjectType,
  useCreateCommentMutation,
  UserObjectType,
} from 'generated';
import { withDiscussion, withUserMe } from 'hocs';
import { useLanguageHeaderContext } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router from 'next/router';
import * as R from 'ramda';
import React, { ChangeEvent } from 'react';
import { SeoPageProps } from 'types';
import { urls } from 'utils';
import * as Yup from 'yup';

interface AddCommentFormValues {
  user: UserObjectType | null;
  text: string;
  attachment: string | null;
  discussion: DiscussionsUnion | null;
  include: CourseObjectType | SchoolObjectType | null;
}

const AddCommentPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const { t } = useTranslation();
  const { userMe, school } = useAuthContext();
  const { toggleNotification, toggleUnexpectedErrorNotification } = useNotificationsContext();
  const context = useLanguageHeaderContext();
  const { setCommentAttachment, formRef } = useDiscussionContext<AddCommentFormValues>();

  const onCompleted = async ({ createComment }: CreateCommentMutation): Promise<void> => {
    const errors = R.prop('errors', createComment);
    const successMessage = R.prop('successMessage', createComment);
    const course = R.path(['comment', 'course', 'id'], createComment);
    const resource = R.path(['comment', 'resource', 'id'], createComment);
    const school = R.path(['comment', 'school', 'id'], createComment);
    const comment = R.path(['comment', 'id'], createComment);

    if (errors.length) {
      toggleUnexpectedErrorNotification();
    } else if (!!successMessage && (!!course || !!resource || !!school)) {
      formRef.current?.resetForm();
      setCommentAttachment(null);
      toggleNotification(successMessage);

      const pathname = course
        ? urls.course(course)
        : resource
        ? urls.resource(resource)
        : school && urls.school(school);

      await Router.push({
        pathname,
        query: {
          comment,
        },
      });

      sa_event('create_comment');
    } else {
      toggleUnexpectedErrorNotification();
    }
  };

  const [createCommentMutation] = useCreateCommentMutation({
    onCompleted,
    onError: toggleUnexpectedErrorNotification,
  });

  // See if course, resource or school is selected or a course or school is included.
  const handleSubmit = async ({
    discussion,
    include,
    user: _user,
    ...values
  }: AddCommentFormValues): Promise<void> => {
    const user = R.prop('id', _user);

    const course =
      discussion?.__typename === 'CourseObjectType'
        ? discussion.id
        : include?.__typename === 'CourseObjectType'
        ? include.id
        : null;

    const resource = discussion?.__typename === 'ResourceObjectType' ? discussion.id : null;

    const school =
      discussion?.__typename === 'SchoolObjectType'
        ? discussion.id
        : include?.__typename === 'SchoolObjectType'
        ? include.id
        : null;

    await createCommentMutation({
      variables: { ...values, user, course, resource, school },
      context,
    });

    formRef.current?.setSubmitting(false);
  };

  const initialValues = {
    user: userMe,
    discussion: school,
    include: null,
    attachment: null,
    text: '',
  };

  const validationSchema = Yup.object().shape({
    discussion: Yup.mixed().required(t('validation:required')),
    text: Yup.string().when('attachment', {
      is: (attachment: string) => !attachment,
      then: Yup.string().required(t('validation:textOrAttachmentRequired')),
      otherwise: Yup.string(),
    }),
  });

  const renderDiscussionField = (
    <Field
      name="discussion"
      label={t('forms:discussion')}
      dataKey="autocompleteDiscussions"
      searchKey="searchTerm"
      labelKeys={['name', 'title', 'courseName']}
      suffixKey="code"
      document={AutocompleteDiscussionsDocument}
      component={AutocompleteField}
      helperText={t('add-comment:schoolHelperText')}
    />
  );

  const renderIncludeField = ({ values }: FormikProps<AddCommentFormValues>) => {
    const visible = ['CourseObjectType', 'ResourceObjectType'].includes(
      String(values.discussion?.__typename),
    );

    const course: CourseObjectType | null = R.pathOr(null, ['discussion', 'course'], values);
    const school: SchoolObjectType | null = R.pathOr(null, ['discussion', 'school'], values);
    const href = course ? urls.course(course.id) : school ? urls.school(school.id) : '#';
    const name = course?.name || school?.name;

    const handleChange = (_: ChangeEvent<Record<string, unknown>>, checked: string) => {
      const val = checked ? course || school : null;
      formRef.current?.setFieldValue('include', val);
    };

    const renderLabel = (
      <>
        {t('forms:alsoSendTo')} <TextLink href={href}>{name}</TextLink>
      </>
    );

    return (
      <Collapse in={visible}>
        <Field
          name="include"
          label={renderLabel}
          component={CheckboxFormField}
          onChange={handleChange}
        />
      </Collapse>
    );
  };

  const renderAuthorSelection = (props: FormikProps<AddCommentFormValues>) =>
    !!userMe && (
      <FormControl>
        <AuthorSelection {...props} />
      </FormControl>
    );

  const renderTextFieldToolbar = <CommentTextFieldToolbar />;
  const renderAttachmentPreview = <CommentAttachmentPreview />;
  const renderAttachmentInput = <CommentAttachmentInput />;

  const getPlaceholder = (discussion: AddCommentFormValues['discussion']) =>
    discussion
      ? t('forms:postTo', {
          target:
            R.prop('name', discussion) ||
            R.prop('title', discussion) ||
            R.prop('courseName', discussion),
        })
      : t('forms:selectDiscussionToPost');

  const renderTextField = (props: FormikProps<AddCommentFormValues>) => (
    <CommentTextField {...props} placeholder={getPlaceholder(props.values.discussion)} />
  );

  const renderFormSubmitSection = (props: FormikProps<AddCommentFormValues>) => (
    <FormSubmitSection submitButtonText={t('common:send')} {...props} />
  );

  const renderFormFields = (props: FormikProps<AddCommentFormValues>) => (
    <Form>
      {renderDiscussionField}
      {renderIncludeField(props)}
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

import { DiscussionsUnion } from '__generated__/src/graphql/common.graphql';
import FormControl from '@material-ui/core/FormControl';
import {
  AuthorSelection,
  AutocompleteField,
  CommentAttachmentInput,
  CommentAttachmentPreview,
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
  UserObjectType,
} from 'generated';
import { withDiscussion, withUserMe } from 'hocs';
import { useLanguageHeaderContext } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { SeoPageProps } from 'types';
import { urls } from 'utils';
import * as Yup from 'yup';

interface AddCommentFormValues {
  user: UserObjectType | null;
  text: string;
  attachment: string | null;
  discussion: DiscussionsUnion | null;
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
    const school = R.path(['comment', 'school', 'id'], createComment);
    const comment = R.path(['comment', 'id'], createComment);

    if (errors.length) {
      toggleUnexpectedErrorNotification();
    } else if (!!successMessage && !!school) {
      formRef.current?.resetForm();
      setCommentAttachment(null);
      toggleNotification(successMessage);

      await Router.push({
        pathname: urls.school(school),
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
    user: _user,
    ...values
  }: AddCommentFormValues): Promise<void> => {
    const user = R.prop('id', _user);
    const school = R.prop('id', discussion);

    await createCommentMutation({
      variables: { ...values, user, school },
      context,
    });

    formRef.current?.setSubmitting(false);
  };

  const initialValues = {
    user: userMe,
    discussion: school,
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
      dataKey="autocompleteSchools"
      searchKey="name"
      suffixKey="code"
      document={AutocompleteSchoolsDocument}
      component={AutocompleteField}
      helperText={t('add-comment:schoolHelperText')}
    />
  );

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
          target: R.prop('name', discussion),
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

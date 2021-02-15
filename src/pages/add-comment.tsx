import { DiscussionsUnion, UserMeFieldsFragment } from '__generated__/src/graphql/common.graphql';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { makeStyles } from '@material-ui/core/styles';
import {
  AuthorSelection,
  AutocompleteField,
  CommentAttachmentInput,
  CommentAttachmentPreview,
  CommentTextField,
  CommentTextFieldToolbar,
  ErrorTemplate,
  FormErrorMessage,
  FormSubmitSection,
  FormTemplate,
  LoadingTemplate,
} from 'components';
import { useAuthContext, useDiscussionContext, useNotificationsContext } from 'context';
import { ErrorMessage, Field, Form, Formik, FormikProps } from 'formik';
import {
  AutocompleteSchoolsDocument,
  CreateCommentMutation,
  useCreateCommentMutation,
  useDiscussionSuggestionsLazyQuery,
} from 'generated';
import { withDiscussion, withUserMe } from 'hocs';
import { useLanguageHeaderContext } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router from 'next/router';
import * as R from 'ramda';
import React, { ChangeEvent, useEffect, useMemo } from 'react';
import { SeoPageProps } from 'types';
import { urls } from 'utils';
import * as Yup from 'yup';

const useStyles = makeStyles(({ spacing }) => ({
  discussionSuggestions: {
    padding: spacing(4),
  },
  discussionSuggestionsLabel: {
    marginBottom: spacing(2),
  },
}));

interface AddCommentFormValues {
  user: UserMeFieldsFragment | null;
  text: string;
  attachment: string | null;
  discussion: DiscussionsUnion | null;
}

const AddCommentPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { userMe } = useAuthContext();
  const { toggleNotification, toggleUnexpectedErrorNotification } = useNotificationsContext();
  const context = useLanguageHeaderContext();
  const { setCommentAttachment, formRef } = useDiscussionContext<AddCommentFormValues>();

  const [
    discussionSuggestionsQuery,
    { data, loading, error },
  ] = useDiscussionSuggestionsLazyQuery();

  const discussionSuggestions: DiscussionsUnion[] = R.propOr([], 'discussionSuggestions', data);

  useEffect(() => {
    !!userMe && discussionSuggestionsQuery();
  }, [userMe]);

  const onCompleted = async ({ createComment }: CreateCommentMutation): Promise<void> => {
    if (createComment?.errors?.length) {
      toggleUnexpectedErrorNotification();
    } else if (
      !!createComment?.successMessage &&
      (!!createComment.comment?.course ||
        !!createComment.comment?.resource ||
        !!createComment.comment?.school)
    ) {
      const { id: comment, course, resource, school } = createComment.comment;

      formRef.current?.resetForm();
      setCommentAttachment(null);
      toggleNotification(createComment.successMessage);

      const pathname = resource
        ? urls.resource(resource.slug || '')
        : course
        ? urls.course(course.slug || '')
        : school
        ? urls.school(school.slug || '')
        : '#';

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
    user: _user,
    ...values
  }: AddCommentFormValues): Promise<void> => {
    const user = R.prop('id', _user);
    let course = null;
    let resource = null;
    let school = null;

    if (userMe) {
      course = discussion?.__typename === 'CourseObjectType' ? discussion.slug : null;
      resource = discussion?.__typename === 'ResourceObjectType' ? discussion.slug : null;
      school = discussion?.__typename === 'SchoolObjectType' ? discussion.slug : null;
    } else {
      school = R.prop('id', discussion);
    }

    await createCommentMutation({
      variables: { ...values, user, course, resource, school },
      context,
    });

    formRef.current?.setSubmitting(false);
  };

  // Only re-render when one of the dynamic values changes - the form values will reset every time.
  const initialValues = useMemo(
    () => ({
      user: userMe,
      discussion: null,
      attachment: null,
      text: '',
    }),
    [userMe],
  );

  const validationSchema = Yup.object().shape({
    discussion: Yup.mixed().required(t('validation:required')),
    text: Yup.string().when('attachment', {
      is: (attachment: string) => !attachment,
      then: Yup.string().required(t('validation:textOrAttachmentRequired')),
      otherwise: Yup.string(),
    }),
  });

  const handleRadioGroupChange = (_e: ChangeEvent<HTMLInputElement>, value: string) => {
    const discussionAttrs = value.split('-');

    const discussion = discussionSuggestions.find(
      (s) => s.__typename === discussionAttrs[0] && s.slug === discussionAttrs[1],
    );

    formRef.current?.setFieldValue('discussion', discussion);
  };

  // Render for unauthenticated users and for user's that have no discussion suggestions.
  const renderDiscussionField = (!userMe || (!!userMe && !discussionSuggestions.length)) && (
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

  const renderDiscussionSuggestionLabel = (d: DiscussionsUnion) => {
    switch (d.__typename) {
      case 'CourseObjectType': {
        // @ts-ignore: `courseName` has been renamed in the GraphQL query.
        return d.code ? `${d.courseName} (${d.code})` : d.courseName;
      }

      case 'ResourceObjectType': {
        return `${d.title} (${d.course.name})`;
      }

      case 'SchoolObjectType': {
        return d.name;
      }
    }
  };

  const mapDiscussionSuggestions = discussionSuggestions.map((d, i) => (
    <FormControlLabel
      value={`${d.__typename}-${d.slug}`} // Radio values must be string.
      control={<Radio />}
      label={renderDiscussionSuggestionLabel(d)}
      key={i}
    />
  ));

  // Render for authenticated users that have discussion suggestions.
  const renderDiscussionSuggestions = !!userMe && !!discussionSuggestions.length && (
    <FormControl className={classes.discussionSuggestions}>
      <FormLabel className={classes.discussionSuggestionsLabel}>
        {t('add-comment:selectDiscussion')}
      </FormLabel>
      <RadioGroup value={formRef.current?.values.discussion} onChange={handleRadioGroupChange}>
        {mapDiscussionSuggestions}
      </RadioGroup>
      <ErrorMessage name="discussion" component={FormErrorMessage} />
    </FormControl>
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
      {renderDiscussionSuggestions}
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

  if (loading) {
    return <LoadingTemplate seoProps={seoProps} />;
  }

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" seoProps={seoProps} />;
  }

  if (error) {
    return <ErrorTemplate variant="error" seoProps={seoProps} />;
  }

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

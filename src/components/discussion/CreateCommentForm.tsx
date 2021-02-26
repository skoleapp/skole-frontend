import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import Fab from '@material-ui/core/Fab';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import SendOutlined from '@material-ui/icons/SendOutlined';
import {
  useAuthContext,
  useDiscussionContext,
  useNotificationsContext,
  usePdfViewerContext,
} from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  CommentObjectType,
  CourseObjectType,
  CreateCommentMutation,
  ResourceObjectType,
  SchoolObjectType,
  useCreateCommentMutation,
  UserMeFieldsFragment,
} from 'generated';
import { useLanguageHeaderContext, useMediaQueries } from 'hooks';
import { dataUriToFile, useTranslation } from 'lib';
import * as R from 'ramda';
import React, { ChangeEvent, useEffect, useMemo } from 'react';
import { SecondaryDiscussion } from 'types';
import { urls } from 'utils';

import { DialogHeader, SkoleDialog } from '../dialogs';
import { CheckboxFormField } from '../form-fields';
import { LoadingBox, TextLink } from '../shared';
import { AuthorSelection } from './AuthorSelection';
import { CommentAttachmentButton } from './CommentAttachmentButton';
import { CommentAttachmentInput } from './CommentAttachmentInput';
import { CommentAttachmentPreview } from './CommentAttachmentPreview';
import { CommentTextField } from './CommentTextField';
import { CommentTextFieldHelperText } from './CommentTextFieldHelperText';
import { CommentTextFieldToolbar } from './CommentTextFieldToolbar';

const useStyles = makeStyles(({ spacing }) => ({
  desktopContainer: {
    padding: spacing(2),
  },
  desktopTextField: {
    margin: `${spacing(2)} 0`,
  },
  dialogTextField: {
    margin: 0,
  },
  attachmentPreview: {
    marginBottom: 'auto',
  },
  desktopSendButton: {
    minWidth: '7.5rem',
  },
  desktopSendButtonSpan: {
    marginLeft: 'auto',
  },
  dialogSendButton: {
    marginLeft: spacing(2),
  },
  dialogContent: {
    display: 'flex',
    padding: spacing(2),
    overflow: 'hidden',
  },
  loadingDialogContent: {
    minHeight: '15rem',
    display: 'flex',
  },
}));

interface CreateCommentFormValues {
  user: UserMeFieldsFragment | null;
  text: string;
  attachment: string | null;
  course: CourseObjectType | null;
  resource: ResourceObjectType | null;
  comment: CommentObjectType | null;
  school: SchoolObjectType | null;
  secondaryDiscussion: SecondaryDiscussion;
}

interface CreateCommentFormProps
  extends Pick<CreateCommentFormValues, 'course' | 'resource' | 'school' | 'comment'> {
  onCommentCreated: () => void;
  placeholder: string;
  resetCommentTarget: () => void;
}

export const CreateCommentForm: React.FC<CreateCommentFormProps> = ({
  course,
  resource,
  school,
  comment,
  onCommentCreated,
  placeholder,
  resetCommentTarget,
}) => {
  const {
    createCommentDialogOpen,
    setCreateCommentDialogOpen,
    setCommentAttachment,
    formRef,
  } = useDiscussionContext<CreateCommentFormValues>();

  const classes = useStyles();
  const { t } = useTranslation();
  const { userMe } = useAuthContext();
  const { isTabletOrDesktop } = useMediaQueries();
  const { screenshot, setScreenshot, drawingMode } = usePdfViewerContext();
  const { toggleNotification, toggleUnexpectedErrorNotification } = useNotificationsContext();
  const context = useLanguageHeaderContext();

  // Use screenshot as attachment if area has been marked and drawing mode is toggled off.
  useEffect(() => {
    if (screenshot && !drawingMode) {
      setCommentAttachment(screenshot); // Already in data URL form.
      const screenShotFile = dataUriToFile(screenshot);
      formRef.current?.setFieldValue('attachment', screenShotFile);
    }
  }, [screenshot, drawingMode, formRef, setCommentAttachment]);

  const handleCloseCreateCommentDialog = (): void => {
    formRef.current?.setFieldValue('attachment', null);
    setCreateCommentDialogOpen(false);
    setCommentAttachment(null);
    resetCommentTarget();

    if (setScreenshot) {
      setScreenshot(null); // Not defined when in course page.
    }
  };

  const onCompleted = ({ createComment }: CreateCommentMutation): void => {
    if (createComment?.errors?.length) {
      toggleUnexpectedErrorNotification();
    } else if (createComment?.successMessage) {
      toggleNotification(createComment.successMessage);
      onCommentCreated();
      sa_event('create_comment');
    } else {
      toggleUnexpectedErrorNotification();
    }
  };

  const [createCommentMutation] = useCreateCommentMutation({
    onCompleted,
    onError: toggleUnexpectedErrorNotification,
  });

  const handleSubmit = async ({
    user: _user,
    text,
    attachment,
    course: _course,
    resource: _resource,
    school: _school,
    comment: _comment,
    secondaryDiscussion,
  }: CreateCommentFormValues): Promise<void> => {
    if (!text && !attachment) {
      toggleNotification(t('validation:textOrAttachmentRequired'));
    } else {
      const user = R.prop('id', _user);

      const secondaryCourse =
        secondaryDiscussion?.__typename === 'CourseObjectType' ? secondaryDiscussion.id : null;

      // Use course as either primary or secondary target for non-replies.
      const course = !_comment ? R.propOr(secondaryCourse, 'id', _course) : null;

      // Use resource only as primary target for non-replies.
      const resource = !_comment ? R.prop('id', _resource) : null;

      const secondarySchool =
        secondaryDiscussion?.__typename === 'SchoolObjectType' ? secondaryDiscussion.id : null;

      // Use school as either primary or secondary target for non-replies.
      const school = !_comment ? R.propOr(secondarySchool, 'id', _school) : null;

      // Use comment only as primary target for all replies.
      const comment = R.prop('id', _comment);

      await createCommentMutation({
        variables: { user, text, attachment, course, resource, school, comment },
        context,
      });

      formRef.current?.resetForm();
      handleCloseCreateCommentDialog();
      formRef.current?.setSubmitting(false);
    }
  };

  // Only re-render when one of the dynamic values changes - the form values will reset every time.
  const initialValues = useMemo(
    () => ({
      user: userMe,
      text: '',
      attachment: null,
      course,
      resource,
      school,
      comment,
      secondaryDiscussion: null,
    }),
    [userMe, course, resource, school, comment],
  );

  const renderDialogTextFieldToolbar = <CommentTextFieldToolbar />;
  const renderAttachmentButton = <CommentAttachmentButton />;
  const renderAttachmentInput = <CommentAttachmentInput dialog />;
  const renderHelperText = <CommentTextFieldHelperText />;

  const renderAttachmentPreview = (
    <CommentAttachmentPreview className={classes.attachmentPreview} />
  );

  const renderAuthorSelection = (
    props: FormikProps<CreateCommentFormValues>,
  ): JSX.Element | false => !!userMe && <AuthorSelection {...props} />;

  const renderDialogAuthorSelection = (
    props: FormikProps<CreateCommentFormValues>,
  ): JSX.Element | false => !!userMe && <FormControl>{renderAuthorSelection(props)}</FormControl>;

  const handleChange = (_: ChangeEvent<HTMLInputElement>, checked: boolean): void => {
    const secondaryDiscussion = course?.school || resource?.course;
    const val = checked ? secondaryDiscussion : null;
    formRef.current?.setFieldValue('secondaryDiscussion', val);
  };

  const secondaryDiscussionLinkHref =
    (resource?.course.slug && urls.course(resource.course.slug)) ||
    (course?.school.slug && urls.school(course.school.slug)) ||
    '#';

  const renderSecondaryDiscussionLink = (
    <TextLink href={secondaryDiscussionLinkHref}>
      #{resource?.course.slug || course?.school.slug}
    </TextLink>
  );

  const renderLabel = (
    <Typography variant="body2" color="textSecondary">
      {t('forms:alsoSendTo')} {renderSecondaryDiscussionLink}
    </Typography>
  );

  const renderSecondaryDiscussionField = (!!course || !!resource) && !comment && (
    <Field
      name="secondaryDiscussion"
      formControlProps={{ margin: 'none', className: 'form-text' }}
      component={CheckboxFormField}
      onChange={handleChange}
      label={renderLabel}
    />
  );

  const renderDesktopTextField = (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <CommentTextField
      placeholder={placeholder}
      value={createCommentDialogOpen ? '' : props.values.text}
      className={classes.desktopTextField}
      {...props}
    />
  );

  const renderDialogTextField = (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <CommentTextField
      placeholder={placeholder}
      className={classes.dialogTextField}
      rows="1"
      {...props}
    />
  );

  const renderDialogSendButton = ({
    values: { text, attachment },
  }: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <Tooltip title={t('discussion-tooltips:sendMessage')}>
      <Typography component="span">
        <Fab
          className={classes.dialogSendButton}
          size="small"
          color="primary"
          disabled={!text && !attachment} // Require either text content or an attachment.
          onClick={formRef.current?.submitForm}
        >
          <SendOutlined />
        </Fab>
      </Typography>
    </Tooltip>
  );

  const renderDialogInputArea = (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <FormControl>
      <Grid container alignItems="center" wrap="nowrap">
        {renderDialogTextField(props)}
        {renderDialogSendButton(props)}
      </Grid>
    </FormControl>
  );

  const renderDesktopSendButton = ({
    values: { text, attachment },
  }: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <Tooltip title={t('discussion-tooltips:sendMessage')}>
      <Typography className={classes.desktopSendButtonSpan} component="span">
        <Button
          variant="contained"
          color="primary"
          className={classes.desktopSendButton}
          disabled={(!text && !attachment) || createCommentDialogOpen} // Require either text content or an attachment.
          type="submit"
          endIcon={<SendOutlined />}
        >
          {t('common:send')}
        </Button>
      </Typography>
    </Tooltip>
  );

  const renderDesktopTopToolbar = (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <Grid container alignItems="center" spacing={2}>
      <Grid item xs={6}>
        {renderAuthorSelection(props)}
      </Grid>
      <Grid item xs={6}>
        {renderHelperText}
      </Grid>
    </Grid>
  );

  const renderDesktopBottomToolbar = (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <Grid container alignItems="center" wrap="nowrap">
      {renderAttachmentButton}
      {renderSecondaryDiscussionField}
      {renderDesktopSendButton(props)}
    </Grid>
  );

  const renderDesktopInputArea = (
    props: FormikProps<CreateCommentFormValues>,
  ): JSX.Element | false =>
    isTabletOrDesktop && (
      <>
        {renderDesktopTopToolbar(props)}
        {renderDesktopTextField(props)}
        {renderDesktopBottomToolbar(props)}
      </>
    );

  const renderDialogHeader = (
    <DialogHeader
      text={t('common:addComment')}
      emoji="💬"
      onCancel={handleCloseCreateCommentDialog}
    />
  );

  const renderDialogContent = (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <DialogContent className={classes.dialogContent}>
      <Grid container direction="column" justify="flex-end" wrap="nowrap">
        {renderAttachmentPreview}
        {renderDialogAuthorSelection(props)}
        {renderSecondaryDiscussionField}
        {renderDialogTextFieldToolbar}
        {renderDialogInputArea(props)}
      </Grid>
    </DialogContent>
  );

  const renderCreateCommentDialog = (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <SkoleDialog open={createCommentDialogOpen} onClose={handleCloseCreateCommentDialog}>
      {renderDialogHeader}
      {renderDialogContent(props)}
    </SkoleDialog>
  );

  const renderLoadingDialog = ({
    isSubmitting,
  }: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <SkoleDialog open={isSubmitting} fullScreen={false} fullWidth>
      <DialogContent className={classes.loadingDialogContent}>
        <LoadingBox text={t('discussion:postingComment')} />
      </DialogContent>
    </SkoleDialog>
  );

  const renderFormFields = (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <Form className={classes.desktopContainer}>
      {renderDesktopInputArea(props)}
      {renderCreateCommentDialog(props)}
      {renderLoadingDialog(props)}
      {renderAttachmentInput}
    </Form>
  );

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={initialValues}
      innerRef={formRef}
      enableReinitialize
    >
      {renderFormFields}
    </Formik>
  );
};

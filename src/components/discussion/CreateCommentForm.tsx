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
import { Form, Formik, FormikProps } from 'formik';
import { CreateCommentMutation, useCreateCommentMutation } from 'generated';
import { useLanguageHeaderContext, useMediaQueries } from 'hooks';
import { dataUriToFile, useTranslation } from 'lib';
import * as R from 'ramda';
import React, { useEffect } from 'react';
import { CreateCommentFormValues } from 'types';

import { DialogHeader, SkoleDialog } from '../dialogs';
import { LoadingBox } from '../shared';
import { AuthorSelection } from './AuthorSelection';
import { ClearCommentAttachmentButton } from './ClearCommentAttachmentButton';
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
  },
  loadingDialogContent: {
    minHeight: '15rem',
    display: 'flex',
  },
}));

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
  } = useDiscussionContext();

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
  }, [screenshot, drawingMode]);

  const handleCloseCreateCommentDialog = (): void => {
    formRef.current?.setFieldValue('attachment', null);
    setCreateCommentDialogOpen(false);
    setCommentAttachment(null);
    resetCommentTarget();
    !!setScreenshot && setScreenshot(null); // Not defined when in course page.
  };

  const onCompleted = ({ createComment }: CreateCommentMutation): void => {
    if (createComment) {
      if (!!createComment.errors && !!createComment.errors.length) {
        toggleUnexpectedErrorNotification();
      } else if (createComment.successMessage) {
        toggleNotification(createComment.successMessage);
        onCommentCreated();
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

  const handleSubmit = async ({
    user: _user,
    text,
    attachment,
    course: _course,
    resource: _resource,
    school: _school,
    comment: _comment,
  }: CreateCommentFormValues): Promise<void> => {
    if (!text && !attachment) {
      toggleNotification(t('validation:textOrAttachmentRequired'));
    } else {
      const user = R.prop('id', _user);
      const course = !_comment ? R.prop('id', _course) : null;
      const resource = !_comment ? R.prop('id', _resource) : null;
      const school = !_comment ? R.prop('id', _school) : null;
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

  const initialValues = {
    user: userMe,
    text: '',
    attachment: null,
    course,
    resource,
    school,
    comment,
  };

  const renderClearAttachmentButton = <ClearCommentAttachmentButton />;
  const renderDialogTextFieldToolbar = <CommentTextFieldToolbar />;
  const renderAttachmentButton = <CommentAttachmentButton />;
  const renderAttachmentInput = <CommentAttachmentInput dialog />;
  const renderHelperText = <CommentTextFieldHelperText />;

  const renderAttachmentPreview = (
    <CommentAttachmentPreview className={classes.attachmentPreview} />
  );

  const renderAuthorSelection = (props: FormikProps<CreateCommentFormValues>) =>
    !!userMe && <AuthorSelection {...props} />;

  const renderDialogAuthorSelection = (props: FormikProps<CreateCommentFormValues>) =>
    !!userMe && <FormControl>{renderAuthorSelection(props)}</FormControl>;

  const renderDesktopTextField = (props: FormikProps<CreateCommentFormValues>) => (
    <CommentTextField
      placeholder={placeholder}
      value={createCommentDialogOpen ? '' : props.values.text}
      className={classes.desktopTextField}
      {...props}
    />
  );

  const renderDialogTextField = (props: FormikProps<CreateCommentFormValues>) => (
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

  const renderDialogInputArea = (props: FormikProps<CreateCommentFormValues>) => (
    <FormControl>
      <Grid container alignItems="center" wrap="nowrap">
        {renderDialogTextField(props)}
        {renderDialogSendButton(props)}
      </Grid>
    </FormControl>
  );

  const renderDesktopSendButton = ({
    values: { text, attachment },
  }: FormikProps<CreateCommentFormValues>) => (
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

  const renderDesktopTopToolbar = (props: FormikProps<CreateCommentFormValues>) => (
    <Grid container alignItems="center" spacing={2}>
      <Grid item xs={6}>
        {renderAuthorSelection(props)}
      </Grid>
      <Grid item xs={6}>
        {renderHelperText}
      </Grid>
    </Grid>
  );

  const renderDesktopBottomToolbar = (props: FormikProps<CreateCommentFormValues>) => (
    <Grid container alignItems="center">
      {renderAttachmentButton}
      {renderClearAttachmentButton}
      {renderDesktopSendButton(props)}
    </Grid>
  );

  const renderDesktopInputArea = (props: FormikProps<CreateCommentFormValues>) =>
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

  const renderDialogContent = (props: FormikProps<CreateCommentFormValues>) => (
    <DialogContent className={classes.dialogContent}>
      <Grid container direction="column" justify="flex-end" wrap="nowrap">
        {renderAttachmentPreview}
        {renderDialogAuthorSelection(props)}
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

  const renderLoadingDialog = ({ isSubmitting }: FormikProps<CreateCommentFormValues>) => (
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

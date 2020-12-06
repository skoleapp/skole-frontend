import { Avatar, Box, DialogContent, Grid, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import {
  useAuthContext,
  useDiscussionContext,
  useNotificationsContext,
  usePdfViewerContext,
} from 'context';
import { Form, Formik, FormikProps } from 'formik';
import { CommentObjectType, CreateCommentMutation, useCreateCommentMutation } from 'generated';
import { useForm, useLanguageHeaderContext, useMediaQueries } from 'hooks';
import { dataURItoFile, useTranslation } from 'lib';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { CommentTarget, CreateCommentFormValues, RichTextEditorProps } from 'types';
import { mediaUrl } from 'utils';
import * as R from 'ramda';
import { DialogHeader, SkoleDialog } from '../shared';
import { RichTextEditor } from './RichTextEditor';
import { AuthorSelection } from './AuthorSelection';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  attachmentContainer: {
    width: '100%',
    height: '25rem',
    margin: `${spacing(2)} 0`,
    marginBottom: 'auto',
    position: 'relative',
    [breakpoints.up('md')]: {
      marginBottom: spacing(8),
    },
  },
  attachmentImage: {
    objectFit: 'contain',
  },
  container: {
    [breakpoints.up('md')]: {
      padding: spacing(3),
    },
  },
  dialogContent: {
    display: 'flex',
    padding: spacing(2),
  },
}));

interface CreateCommentFormProps {
  target: CommentTarget;
  appendComments: (comments: CommentObjectType) => void;
}

export const CreateCommentForm: React.FC<CreateCommentFormProps> = ({ appendComments, target }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { isTabletOrDesktop } = useMediaQueries();
  const { screenshot, setScreenshot } = usePdfViewerContext();
  const { toggleNotification } = useNotificationsContext();
  const { formRef, setSubmitting, resetForm, setFieldValue } = useForm<CreateCommentFormValues>();
  const { userMe } = useAuthContext();
  const context = useLanguageHeaderContext();

  const {
    commentModalOpen,
    toggleCommentModal,
    commentAttachment,
    setCommentAttachment,
  } = useDiscussionContext();

  // Use screenshot as attachment if area has been marked.
  useEffect(() => {
    if (screenshot) {
      setCommentAttachment(screenshot); // Already in data URL form.
      const screenShotFile = dataURItoFile(screenshot);
      setFieldValue('attachment', screenShotFile);
    }
  }, [screenshot]);

  const handleCloseCreateCommentModal = (): void => {
    setFieldValue('attachment', null);
    toggleCommentModal(false);
    setCommentAttachment(null);
    !!setScreenshot && setScreenshot(null); // Not defined when in course page.
  };

  const onError = (): void => toggleNotification(t('notifications:messageError'));

  const onCompleted = ({ createComment }: CreateCommentMutation): void => {
    if (createComment) {
      if (!!createComment.errors && !!createComment.errors.length) {
        onError();
      } else if (createComment.comment) {
        appendComments(createComment.comment as CommentObjectType);
      } else {
        onError();
      }
    } else {
      onError();
    }
  };

  const [createCommentMutation] = useCreateCommentMutation({
    onCompleted,
    onError,
  });

  const handleSubmit = async ({
    user: _user,
    text,
    attachment,
    ...values
  }: CreateCommentFormValues): Promise<void> => {
    if (!text && !attachment) {
      toggleNotification(t('notifications:messageEmpty'));
    } else {
      const user = R.prop('id', _user);

      await createCommentMutation({
        variables: { user, text, attachment, ...values },
        context,
      });

      resetForm();
      toggleCommentModal(false);
    }

    setSubmitting(false);
    setCommentAttachment(null);
  };

  const initialValues = {
    user: userMe,
    text: '',
    attachment: null,
    ...target,
  };

  const renderAttachment = !!commentAttachment && (
    <Box className={clsx(classes.attachmentContainer, !!screenshot && 'screenshot-border')}>
      <Image
        layout="fill"
        className={classes.attachmentImage}
        src={String(commentAttachment)}
        unoptimized // Must be used for base64 images for now (v10.0.1). TODO: See if this is fixed in future Next.js versions.
        alt={t('common:commentAttachment')}
      />
    </Box>
  );

  const renderRichTextEditor = (props: RichTextEditorProps): JSX.Element => (
    <RichTextEditor {...props} />
  );

  const renderDesktopInputArea = (
    props: FormikProps<CreateCommentFormValues>,
  ): false | JSX.Element =>
    isTabletOrDesktop && renderRichTextEditor({ ...props, enableAuthorSelection: true });

  const renderHeaderLeft = ({ values }: FormikProps<CreateCommentFormValues>) =>
    !!userMe && (
      <Avatar
        className="avatar-thumbnail"
        src={mediaUrl(R.pathOr('', ['user', 'avatarThumbnail'], values))}
      />
    );

  const renderHeaderCenter = (props: FormikProps<CreateCommentFormValues>) =>
    !!userMe && <AuthorSelection {...props} />;

  const renderCreateCommentModal = (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <SkoleDialog open={commentModalOpen} onClose={handleCloseCreateCommentModal}>
      <DialogHeader
        headerLeft={renderHeaderLeft(props)}
        headerCenter={renderHeaderCenter(props)}
        text={t('forms:createComment')}
        onCancel={handleCloseCreateCommentModal}
      />
      <DialogContent className={classes.dialogContent}>
        <Grid
          className={classes.container}
          container
          direction="column"
          justify="flex-end"
          wrap="nowrap"
        >
          {renderAttachment}
          {renderRichTextEditor(props)}
        </Grid>
      </DialogContent>
    </SkoleDialog>
  );

  const renderFormFields = (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <Form className={classes.container}>
      {renderDesktopInputArea(props)}
      {renderCreateCommentModal(props)}
    </Form>
  );

  return (
    <Formik onSubmit={handleSubmit} initialValues={initialValues} innerRef={formRef}>
      {renderFormFields}
    </Formik>
  );
};

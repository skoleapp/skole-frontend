import { Box, DialogContent, Grid, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { useDiscussionContext, useNotificationsContext, usePdfViewerContext } from 'context';
import { Form, Formik, FormikProps } from 'formik';
import { CommentObjectType, CreateCommentMutation, useCreateCommentMutation } from 'generated';
import { useForm, useLanguageHeaderContext, useMediaQueries } from 'hooks';
import { dataURItoFile, useTranslation } from 'lib';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { CommentTarget, CreateCommentFormValues } from 'types';

import { DialogHeader, SkoleDialog } from '../shared';
import { RichTextEditor } from './RichTextEditor';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  attachmentContainer: {
    width: '100%',
    height: '25rem',
    margin: `${spacing(2)} 0`,
    marginBottom: 'auto',
    position: 'relative',
  },
  attachmentImage: {
    objectFit: 'contain',
  },
  container: {
    [breakpoints.up('md')]: {
      padding: spacing(4),
    },
  },
  dialogContent: {
    display: 'flex',
  },
}));

interface CreateCommentFormProps {
  target: CommentTarget;
  appendComments: (comments: CommentObjectType) => void;
}

export const CreateCommentForm: React.FC<CreateCommentFormProps> = ({ appendComments, target }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { isDesktop } = useMediaQueries();
  const { screenshot, setScreenshot } = usePdfViewerContext();
  const context = useLanguageHeaderContext();
  const { toggleNotification } = useNotificationsContext();
  const { formRef, setSubmitting, resetForm, setFieldValue } = useForm();

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

  const handleSubmit = async (values: CreateCommentFormValues): Promise<void> => {
    if (!commentAttachment && !values.text) {
      toggleNotification(t('notifications:messageEmpty'));
    } else {
      await createCommentMutation({
        variables: { ...values, attachment: values.attachment },
        context,
      });

      resetForm();
      toggleCommentModal(false);
    }

    setSubmitting(false);
    setCommentAttachment(null);
  };

  const initialValues = {
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

  const renderRichTextEditor = (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <RichTextEditor {...props} />
  );

  const renderDesktopInputArea = (
    props: FormikProps<CreateCommentFormValues>,
  ): false | JSX.Element => isDesktop && renderRichTextEditor(props);

  const renderCreateCommentModal = (props: FormikProps<CreateCommentFormValues>): JSX.Element => (
    <SkoleDialog open={commentModalOpen} onClose={handleCloseCreateCommentModal}>
      <DialogHeader onCancel={handleCloseCreateCommentModal} text={t('forms:createComment')} />
      <DialogContent className={classes.dialogContent}>
        <Grid className={classes.container} container direction="column" justify="flex-end">
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
    <Formik onSubmit={handleSubmit} initialValues={initialValues} ref={formRef}>
      {renderFormFields}
    </Formik>
  );
};

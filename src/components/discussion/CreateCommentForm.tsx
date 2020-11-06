import { Box, DialogContent, Grid, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { useDiscussionContext, useNotificationsContext, usePDFViewerContext } from 'context';
import { Form, Formik, FormikProps } from 'formik';
import { CommentObjectType, CreateCommentMutation, useCreateCommentMutation } from 'generated';
import { useForm, useLanguageHeaderContext, useMediaQueries } from 'hooks';
import { dataURItoFile, useTranslation } from 'lib';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { CommentTarget, CreateCommentFormValues } from 'types';

import { DialogHeader } from '..';
import { SkoleDialog } from '../shared/SkoleDialog';
import { RichTextEditor } from './RichTextEditor';

const useStyles = makeStyles(({ spacing }) => ({
    attachmentContainer: {
        width: '100%',
        height: '25rem',
        margin: `${spacing(2)} 0`,
        marginBottom: 'auto',
        position: 'relative',
    },
    container: {
        flexGrow: 1,
        display: 'flex',
    },
    dialogContent: {
        display: 'flex',
    },
}));

type T = FormikProps<CreateCommentFormValues>;

interface CreateCommentFormProps {
    target: CommentTarget;
    appendComments: (comments: CommentObjectType) => void;
}

export const CreateCommentForm: React.FC<CreateCommentFormProps> = ({ appendComments, target }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const { isDesktop } = useMediaQueries();
    const { formRef, setSubmitting, resetForm, setFieldValue } = useForm<CreateCommentFormValues>();
    const { toggleNotification } = useNotificationsContext();
    const { commentModalOpen, toggleCommentModal, commentAttachment, setCommentAttachment } = useDiscussionContext();
    const { screenshot, setScreenshot } = usePDFViewerContext();
    const context = useLanguageHeaderContext();

    // Use screenshot as attachment if area has been marked.
    useEffect(() => {
        if (!!screenshot) {
            setCommentAttachment(screenshot); // Already in data URL form.
            const screenShotFile = dataURItoFile(screenshot);
            setFieldValue('attachment', screenShotFile);
        }
    }, [screenshot]);

    const handleCloseCreateCommentModal = (): void => {
        setFieldValue('attachment', null);
        toggleCommentModal(false);
        setScreenshot(null);
        setCommentAttachment(null);
    };

    const onError = (): void => toggleNotification(t('notifications:messageError'));

    const onCompleted = ({ createComment }: CreateCommentMutation): void => {
        if (!!createComment) {
            if (!!createComment.errors && !!createComment.errors.length) {
                onError();
            } else if (!!createComment.comment && !!createComment.message) {
                appendComments(createComment.comment as CommentObjectType);
            } else {
                onError();
            }
        } else {
            onError();
        }
    };

    const [createCommentMutation] = useCreateCommentMutation({ onCompleted, onError });

    const handleSubmit = async (values: CreateCommentFormValues): Promise<void> => {
        if (!commentAttachment && !values.text) {
            toggleNotification(t('notifications:messageEmpty'));
        } else {
            await createCommentMutation({
                variables: { ...values, attachment: String(values.attachment) },
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

    const renderDesktopInputArea = (formikProps: T): false | JSX.Element =>
        isDesktop && <RichTextEditor {...formikProps} />;

    const renderAttachment = !!commentAttachment && (
        <Box className={clsx(classes.attachmentContainer, !!screenshot && 'screenshot-border')}>
            <Image
                layout="fill"
                src={String(commentAttachment)}
                unoptimized // Must be used for base64 images for now (v10.0.1). TODO: See if this is fixed in future Next.js versions.
                alt={t('common:commentAttachment')}
            />
        </Box>
    );

    const renderRichTextEditor = (formikProps: T): JSX.Element => <RichTextEditor {...formikProps} />;

    const renderCreateCommentModal = (formikProps: T): JSX.Element => (
        <SkoleDialog open={commentModalOpen} onClose={handleCloseCreateCommentModal}>
            <DialogHeader onCancel={handleCloseCreateCommentModal} text={t('forms:createComment')} />
            <DialogContent className={classes.dialogContent}>
                <Grid className={classes.container} container direction="column" justify="flex-end">
                    {renderAttachment}
                    {renderRichTextEditor(formikProps)}
                </Grid>
            </DialogContent>
        </SkoleDialog>
    );

    return (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} ref={formRef}>
            {(props): JSX.Element => (
                <Form className={classes.container}>
                    {renderDesktopInputArea(props)}
                    {renderCreateCommentModal(props)}
                </Form>
            )}
        </Formik>
    );
};

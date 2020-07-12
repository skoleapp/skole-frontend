import { Box, Fab, Fade, IconButton, OutlinedTextFieldProps, Paper, TextField, Tooltip } from '@material-ui/core';
import { AttachFileOutlined, CameraAltOutlined, ClearOutlined, SendOutlined } from '@material-ui/icons';
import {
    useAuthContext,
    useCommentModalContext,
    useDeviceContext,
    useNotificationsContext,
    usePDFViewerContext,
} from 'context';
import { Form, Formik, FormikProps } from 'formik';
import { CommentObjectType, CreateCommentMutation, useCreateCommentMutation } from 'generated';
import { useForm } from 'hooks';
import { dataURItoFile } from 'lib';
import Image from 'material-ui-image';
import * as R from 'ramda';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CommentTarget } from 'types';

import { ModalHeader, StyledModal } from '..';

interface CreateCommentFormValues {
    text: string;
    attachment: File | null;
    course?: string;
    resource?: string;
    comment?: string;
}

type T = FormikProps<CreateCommentFormValues>;

interface CreateCommentFormProps {
    target: CommentTarget;
    appendComments: (comments: CommentObjectType) => void;
    formKey: string;
}

export const CreateCommentForm: React.FC<CreateCommentFormProps> = ({ appendComments, target, formKey }) => {
    const { t } = useTranslation();
    const { verified, verificationRequiredTooltip } = useAuthContext();
    const disabled = verified === false;
    const { ref, setSubmitting, resetForm, submitForm, setFieldValue } = useForm<CreateCommentFormValues>();
    const { toggleNotification } = useNotificationsContext();
    const { commentModalOpen, toggleCommentModal } = useCommentModalContext();
    const { screenshot, setScreenshot } = usePDFViewerContext();
    const [attachment, setAttachment] = useState<string | ArrayBuffer | null>(null);
    const isMobile = useDeviceContext();

    // Use screenshot as attachment if area has been marked.
    useEffect(() => {
        if (!!screenshot) {
            setAttachment(screenshot); // Already in data URL form.
            const screenShotFile = dataURItoFile(screenshot);
            setFieldValue('attachment', screenShotFile);
        }
    }, [screenshot]);

    const handleCloseCreateCommentModal = (): void => {
        setFieldValue('attachment', null);
        toggleCommentModal(false);
        setScreenshot(null);
        setAttachment(null);
    };

    const onError = (): void => toggleNotification(t('notifications:messageError'));

    const onCompleted = ({ createComment }: CreateCommentMutation): void => {
        if (!!createComment) {
            if (!!createComment.errors) {
                onError();
            } else if (!!createComment.comment && !!createComment.message) {
                toggleNotification(createComment.message);
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
        if (!attachment && !values.text) {
            toggleNotification(t('notifications:messageEmpty'));
        } else {
            await createCommentMutation({
                variables: { ...values, attachment: (values.attachment as unknown) as string },
            });

            resetForm();
            toggleCommentModal(false);
        }

        setSubmitting(false);
        setAttachment(null);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setFieldValue('text', e.target.value);
    };

    const handleAttachmentChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const reader = new FileReader();
        const attachment = R.path(['currentTarget', 'files', '0'], e) as File;
        reader.readAsDataURL(attachment);

        reader.onloadend = (): void => {
            setFieldValue('attachment', attachment);
            setAttachment(reader.result);
            toggleCommentModal(true);
        };
    };

    const handleClearAttachment = (): void => {
        setFieldValue('attachment', null);
        setAttachment(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (!e.shiftKey && e.key === 'Enter' && !isMobile) {
            submitForm();
        }
    };

    const initialValues = {
        text: '',
        attachment: null,
        ...target,
    };

    const textFieldProps: OutlinedTextFieldProps = {
        placeholder: t('forms:message'),
        variant: 'outlined',
        onChange: handleChange,
        rowsMax: '5',
        multiline: true,
        autoComplete: 'off',
        fullWidth: true,
        disabled,
    };

    const submitButtonTooltip = !!verificationRequiredTooltip ? verificationRequiredTooltip : t('tooltips:sendMessage');
    const attachmentButtonTooltip = !!verificationRequiredTooltip
        ? verificationRequiredTooltip
        : t('tooltips:attachFile');
    const inputTooltip = !!verificationRequiredTooltip ? verificationRequiredTooltip : '';

    const renderSubmitButton = (
        <Tooltip title={submitButtonTooltip}>
            <span>
                <IconButton onClick={submitForm} disabled={disabled} color="primary" size="small">
                    <SendOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );

    const renderAttachmentButtons = isMobile && (
        <Box display="flex">
            <Box>
                <input
                    value=""
                    id={`camera-attachment-${formKey}`}
                    accept=".png, .jpg, .jpeg"
                    type="file"
                    capture="camera"
                    onChange={handleAttachmentChange}
                    disabled={disabled}
                />
                <label htmlFor={`camera-attachment-${formKey}`}>
                    <Tooltip title={attachmentButtonTooltip}>
                        <span>
                            <Fab disabled={disabled} size="small" color="secondary">
                                <CameraAltOutlined />
                            </Fab>
                        </span>
                    </Tooltip>
                </label>
            </Box>
            {!!attachment && (
                <Box marginLeft="0.5rem">
                    <Tooltip title={t('tooltips:clearAttachment')}>
                        <Fab onClick={handleClearAttachment} size="small" color="secondary">
                            <ClearOutlined />
                        </Fab>
                    </Tooltip>
                </Box>
            )}
        </Box>
    );

    const renderDesktopInputArea = ({ values }: T): false | JSX.Element =>
        !isMobile && (
            <Box id="desktop-input-area" display="flex" alignItems="center">
                <Box marginRight="0.5rem">
                    <input
                        value=""
                        id={`attachment-desktop-${formKey}`}
                        accept=".png, .jpg, .jpeg"
                        type="file"
                        onChange={handleAttachmentChange}
                        disabled={disabled}
                    />
                    <label htmlFor={`attachment-desktop-${formKey}`}>
                        <Tooltip title={attachmentButtonTooltip}>
                            <span>
                                <IconButton disabled={disabled} component="span" size="small">
                                    <AttachFileOutlined />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </label>
                </Box>
                <Tooltip title={inputTooltip}>
                    <span id="desktop-input-container">
                        <TextField
                            onKeyDown={handleKeyDown}
                            value={!values.attachment ? values.text : ''}
                            {...textFieldProps}
                        />
                    </span>
                </Tooltip>
                <Box marginLeft="0.5rem">{renderSubmitButton}</Box>
            </Box>
        );

    const renderCreateCommentModal = ({ values }: T): JSX.Element => (
        <StyledModal open={commentModalOpen} onClose={handleCloseCreateCommentModal} autoHeight>
            <Fade in={commentModalOpen}>
                <Paper>
                    <ModalHeader
                        onCancel={handleCloseCreateCommentModal}
                        headerRight={renderSubmitButton}
                        text={t('common:createComment')}
                    />
                    <StyledAttachmentImage screenshot={screenshot}>
                        {!!attachment && <Image src={attachment as string} />}
                    </StyledAttachmentImage>
                    {renderAttachmentButtons}
                    <Tooltip title={inputTooltip}>
                        <span>
                            <TextField onKeyDown={handleKeyDown} value={values.text} {...textFieldProps} />
                        </span>
                    </Tooltip>
                </Paper>
            </Fade>
        </StyledModal>
    );

    return (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} ref={ref}>
            {(props): JSX.Element => (
                <StyledCreateCommentForm>
                    {renderDesktopInputArea(props)}
                    {renderCreateCommentModal(props)}
                </StyledCreateCommentForm>
            )}
        </Formik>
    );
};

const StyledCreateCommentForm = styled(Form)`
    #desktop-input-area {
        .MuiFormControl-root {
            margin-top: 0;
        }

        #desktop-input-container {
            flex-grow: 1;
        }
    }
`;

// Ignore: screenshot must be omitted from Box props.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledAttachmentImage = styled(({ screenshot, ...props }) => <Box {...props} />)`
    margin-top: 0.5rem;
    flex-grow: 1;

    > div {
        padding-top: 0 !important;

        img {
            height: auto !important;
            position: relative !important;
            max-height: 25rem;

            // If attachment is a screenshot from a document, show a screenshot border around it.
            border: ${({ screenshot }): string => (!!screenshot ? 'var(--screenshot-border)' : 'none')};
        }
    }
`;
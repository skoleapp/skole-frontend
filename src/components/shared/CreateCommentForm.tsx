import { Box, Fab, Fade, IconButton, OutlinedTextFieldProps, Paper, TextField } from '@material-ui/core';
import { AttachFileOutlined, CameraAltOutlined, ClearOutlined, SendOutlined } from '@material-ui/icons';
import { Form, Formik, FormikProps } from 'formik';
import Image from 'material-ui-image';
import * as R from 'ramda';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { CommentObjectType, CreateCommentMutation, useCreateCommentMutation } from '../../../generated/graphql';
import { useCommentModalContext, useDeviceContext, useNotificationsContext } from '../../context';
import { CommentTarget } from '../../types';
import { useForm } from '../../utils';
import { StyledTooltip } from '../shared';
import { ModalHeader } from './ModalHeader';
import { StyledModal } from './StyledModal';

interface Props {
    target: CommentTarget;
    appendComments: (comments: CommentObjectType) => void;
    formKey: string;
}

interface CreateCommentFormValues {
    text: string;
    attachment: File | null;
    course?: string;
    resource?: string;
    resourcePart?: string;
    comment?: string;
}

type T = FormikProps<CreateCommentFormValues>;

export const CreateCommentForm: React.FC<Props> = ({ appendComments, target, formKey }) => {
    const { t } = useTranslation();
    const { ref, setSubmitting, resetForm, submitForm, setFieldValue } = useForm<CreateCommentFormValues>();
    const [attachment, setAttachment] = useState<string | ArrayBuffer | null>(null);
    const { toggleNotification } = useNotificationsContext();
    const { commentModalOpen, toggleCommentModal } = useCommentModalContext();
    const isMobile = useDeviceContext();

    const handleCloseCreateCommentModal = (): void => {
        setFieldValue('attachment', null);
        toggleCommentModal(false);
    };

    const onError = (): void => toggleNotification(t('notifications:messageError'));

    const onCompleted = ({ createComment }: CreateCommentMutation): void => {
        if (createComment) {
            if (createComment.errors) {
                onError();
            } else if (createComment.comment) {
                toggleNotification(t('notifications:messageSubmitted'));
                appendComments(createComment.comment as CommentObjectType);
            }
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
        if (!e.shiftKey && e.key === 'Enter') {
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
    };

    const renderSubmitButton = (
        <StyledTooltip title={t('common:sendMessageTooltip')}>
            <IconButton onClick={submitForm} color="primary" size="small">
                <SendOutlined />
            </IconButton>
        </StyledTooltip>
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
                />
                <label htmlFor={`camera-attachment-${formKey}`}>
                    <StyledTooltip title={t('common:attachFileTooltip')}>
                        <Fab component="span" size="small">
                            <CameraAltOutlined />
                        </Fab>
                    </StyledTooltip>
                </label>
            </Box>
            {!!attachment && (
                <Box marginLeft="0.5rem">
                    <StyledTooltip title={t('common:clearAttachmentTooltip')}>
                        <Fab onClick={handleClearAttachment} size="small">
                            <ClearOutlined />
                        </Fab>
                    </StyledTooltip>
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
                    />
                    <label htmlFor={`attachment-desktop-${formKey}`}>
                        <StyledTooltip title={t('common:attachFileTooltip')}>
                            <IconButton component="span" size="small">
                                <AttachFileOutlined />
                            </IconButton>
                        </StyledTooltip>
                    </label>
                </Box>
                <TextField
                    onKeyDown={handleKeyDown}
                    value={!values.attachment ? values.text : ''}
                    {...textFieldProps}
                />
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
                        title={t('common:createComment')}
                    />
                    <StyledAttachmentImage>
                        {!!attachment && <Image src={attachment as string} />}
                    </StyledAttachmentImage>
                    {renderAttachmentButtons}
                    <TextField onKeyDown={handleKeyDown} value={values.text} {...textFieldProps} />
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
    }
`;

const StyledAttachmentImage = styled(Box)`
    margin-top: 0.5rem;
    flex-grow: 1;

    > div {
        padding-top: 0 !important;

        img {
            height: auto !important;
            position: relative !important;
            max-height: 25rem;
        }
    }
`;

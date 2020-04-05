import { Box, Fab, Fade, IconButton, OutlinedTextFieldProps, Paper, TextField } from '@material-ui/core';
import { AttachFileOutlined, CameraAltOutlined, ClearOutlined, SendOutlined } from '@material-ui/icons';
import { Form, Formik, FormikProps } from 'formik';
import Image from 'material-ui-image';
import * as R from 'ramda';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { CommentObjectType, CreateCommentMutation, useCreateCommentMutation } from '../../../generated/graphql';
import { toggleNotification } from '../../actions';
import { breakpointsNum } from '../../styles';
import { CommentTarget } from '../../types';
import { useBreakPoint, useForm } from '../../utils';
import { ModalHeader } from './ModalHeader';
import { StyledModal } from './StyledModal';

interface Props {
    target: CommentTarget;
    appendComments: (comments: CommentObjectType) => void;
    createCommentModalOpen: boolean;
    toggleCreateCommentModal: (val: boolean) => void;
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

export const CreateCommentForm: React.FC<Props> = ({
    appendComments,
    target,
    createCommentModalOpen,
    toggleCreateCommentModal,
    formKey,
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { ref, setSubmitting, resetForm, submitForm, setFieldValue } = useForm<CreateCommentFormValues>();
    const [attachment, setAttachment] = useState<string | ArrayBuffer | null>(null);
    const isMobile = useBreakPoint(breakpointsNum.MD);

    const handleCloseCreateCommentModal = (): void => {
        setFieldValue('attachment', null);
        toggleCreateCommentModal(false);
    };

    const onError = (): void => {
        dispatch(toggleNotification(t('notifications:messageError')));
    };

    const onCompleted = ({ createComment }: CreateCommentMutation): void => {
        if (createComment) {
            if (createComment.errors) {
                onError();
            } else if (createComment.comment) {
                dispatch(toggleNotification(t('notifications:messageSubmitted')));
                appendComments(createComment.comment as CommentObjectType);
            }
        }
    };

    const [createCommentMutation] = useCreateCommentMutation({ onCompleted, onError });

    const handleSubmit = async (values: CreateCommentFormValues): Promise<void> => {
        if (!attachment && !values.text) {
            dispatch(toggleNotification(t('notifications:messageEmpty')));
        } else {
            await createCommentMutation({
                variables: { ...values, attachment: (values.attachment as unknown) as string },
            });

            resetForm();
            toggleCreateCommentModal(false);
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
            toggleCreateCommentModal(true);
        };
    };

    const handleClearAttachment = (): void => {
        setFieldValue('attachment', null);
        setAttachment(null);
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
        <IconButton onClick={submitForm} color="primary" size="small">
            <SendOutlined />
        </IconButton>
    );

    const renderDesktopInputArea = ({ values }: T): JSX.Element => (
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
                    <IconButton component="span" size="small">
                        <AttachFileOutlined />
                    </IconButton>
                </label>
            </Box>
            <TextField value={!values.attachment ? values.text : ''} {...textFieldProps} />
            {!isMobile && <Box marginLeft="0.5rem">{renderSubmitButton}</Box>}
        </Box>
    );

    const renderCreateCommentModal = ({ values }: T): JSX.Element => (
        <StyledModal open={createCommentModalOpen} onClose={handleCloseCreateCommentModal} autoHeight>
            <Fade in={createCommentModalOpen}>
                <Paper>
                    <ModalHeader
                        onCancel={handleCloseCreateCommentModal}
                        headerRight={renderSubmitButton}
                        title={t('common:createComment')}
                    />
                    <StyledAttachmentImage>
                        {!!attachment && <Image src={attachment as string} />}
                    </StyledAttachmentImage>
                    {isMobile && (
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
                                    <Fab component="span" size="small">
                                        <CameraAltOutlined />
                                    </Fab>
                                </label>
                            </Box>
                            {!!attachment && (
                                <Box marginLeft="0.5rem">
                                    <Fab onClick={handleClearAttachment} size="small">
                                        <ClearOutlined />
                                    </Fab>
                                </Box>
                            )}
                        </Box>
                    )}
                    <StyledTextInput value={values.text} {...textFieldProps} />
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

const StyledTextInput = styled(TextField)`
    .MuiInputBase-root {
        margin-bottom: 1rem;
    }
`;

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

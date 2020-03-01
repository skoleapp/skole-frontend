import { Box, Fade, IconButton, OutlinedTextFieldProps, Paper, TextField } from '@material-ui/core';
import { AttachFileOutlined, SendOutlined } from '@material-ui/icons';
import { Field, Form, Formik, FormikProps } from 'formik';
import * as R from 'ramda';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { CommentObjectType, CreateCommentMutation, useCreateCommentMutation } from '../../../generated/graphql';
import { toggleNotification } from '../../actions';
import { CommentTarget } from '../../types';
import { useForm } from '../../utils';
import { DropzoneField } from './DropzoneField';
import { ModalHeader } from './ModalHeader';
import { StyledModal } from './StyledModal';

interface Props {
    target: CommentTarget;
    appendComments: (comments: CommentObjectType) => void;
    createCommentModalOpen: boolean;
    toggleCreateCommentModal: (val: boolean) => void;
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
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [initialAttachment, setInitialAttachment] = useState<string | ArrayBuffer | null>(null);
    const { ref, setSubmitting, resetForm, submitForm, setFieldValue } = useForm<CreateCommentFormValues>();

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
        if (!!values.text) {
            await createCommentMutation({
                variables: { ...values, attachment: (values.attachment as unknown) as string },
            });

            resetForm();
            toggleCreateCommentModal(false);
        } else {
            dispatch(toggleNotification(t('notifications:messageEmpty')));
        }

        setSubmitting(false);
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
            setInitialAttachment(reader.result);
            toggleCreateCommentModal(true);
        };
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
        <IconButton onClick={submitForm} color="primary">
            <SendOutlined />
        </IconButton>
    );

    const renderDesktopInputArea = ({ values }: T): JSX.Element => (
        <Box display="flex" alignItems="center">
            <Box marginRight="0.5rem">
                <input value="" id="attachment" accept="image/*" type="file" onChange={handleAttachmentChange} />
                <label htmlFor="attachment">
                    <IconButton component="span">
                        <AttachFileOutlined />
                    </IconButton>
                </label>
            </Box>
            <TextField value={!values.attachment ? values.text : ''} {...textFieldProps} />
            <Box className="md-up" marginLeft="0.5rem">
                {renderSubmitButton}
            </Box>
        </Box>
    );

    const renderCreateCommentModal = ({ values }: T): JSX.Element => (
        <StyledModal open={!!createCommentModalOpen} onClose={handleCloseCreateCommentModal} autoHeight>
            <Fade in={!!createCommentModalOpen}>
                <Paper>
                    <ModalHeader
                        onCancel={handleCloseCreateCommentModal}
                        headerRight={renderSubmitButton}
                        title={t('common:createComment')}
                    />
                    <Box id="comment-attachment-container">
                        <Field name="attachment" component={DropzoneField} initialFiles={[initialAttachment]} />
                    </Box>
                    <Box className="modal-input-area">
                        <TextField value={values.text} {...textFieldProps} />
                    </Box>
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
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .MuiFormControl-root {
        margin-top: 0;
    }
`;

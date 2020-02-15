import { Box, IconButton } from '@material-ui/core';
import { AttachmentOutlined } from '@material-ui/icons';
import { Formik } from 'formik';
import dynamic, { LoaderComponent } from 'next/dynamic';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { CommentObjectType, CreateCommentMutation, useCreateCommentMutation } from '../../../generated/graphql';
import { toggleNotification } from '../../actions';
import { CommentTarget } from '../../types';
import { useForm } from '../../utils';
import { FormSubmitSection } from './FormSubmitSection';
import { StyledForm } from './StyledForm';

const DynamicTextEditor: any = dynamic(
    (): LoaderComponent<{}> => (import('./TextEditor') as unknown) as LoaderComponent<{}>,
    {
        ssr: false,
    },
);

interface Props {
    target: CommentTarget;
    appendComments: (comments: CommentObjectType) => void;
}

interface CreateCommentFormValues {
    text: string;
    attachment: string;
    course?: string;
    resource?: string;
    resourcePart?: string;
    comment?: string;
}

export const CreateCommentForm: React.FC<Props> = ({ appendComments, target }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { ref, setSubmitting, resetForm, setFieldValue } = useForm<CreateCommentFormValues>();

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
        console.log(values);
        await createCommentMutation({ variables: { ...values } });
        setSubmitting(false);
        resetForm();
    };

    const handleChange = (val: string): void => setFieldValue('text', val);

    // const handleKeyPress = (e: KeyboardEvent): void => {
    //     if (e.key === 'Enter') {
    //         submitForm();
    //     }
    // };

    const initialValues = {
        text: '',
        attachment: '',
        ...target,
    };

    return (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} ref={ref}>
            {(props): JSX.Element => (
                <StyledCreateCommentForm>
                    <DynamicTextEditor value={props.values.text} onChange={handleChange} />
                    <Box display="flex" alignItems="center">
                        <FormSubmitSection submitButtonText={t('forms:submit')} {...props} />
                        <IconButton>
                            <AttachmentOutlined />
                        </IconButton>
                    </Box>
                </StyledCreateCommentForm>
            )}
        </Formik>
    );
};

const StyledCreateCommentForm = styled(StyledForm)`
    display: flex;
    flex-direction: column;

    .MuiIconButton-root {
        padding: 0.5rem;
        margin-top: 0.75rem;
        margin-left: 0.5rem;
    }
`;

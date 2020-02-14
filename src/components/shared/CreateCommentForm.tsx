import { Field, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { useDispatch } from 'react-redux';

import { CommentObjectType, CreateCommentMutation, useCreateCommentMutation } from '../../../generated/graphql';
import { toggleNotification } from '../../actions';
import { useTranslation } from '../../i18n';
import { CommentTarget } from '../../types';
import { useForm } from '../../utils';
import { StyledForm } from './StyledForm';

interface Props {
    label: string;
    placeholder: string;
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

export const CreateCommentForm: React.FC<Props> = ({ label, placeholder, target, appendComments }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { ref, setSubmitting, resetForm, submitForm } = useForm<CreateCommentFormValues>();

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
        await createCommentMutation({ variables: { ...values } });
        setSubmitting(false);
        resetForm();
    };

    const handleKeyPress = (e: KeyboardEvent): void => {
        if (e.key === 'Enter') {
            submitForm();
        }
    };

    const initialValues = {
        text: '',
        attachment: '',
        ...target,
    };

    return (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} ref={ref}>
            {(): JSX.Element => (
                <StyledForm>
                    <Field
                        name="text"
                        label={label}
                        placeholder={placeholder}
                        variant="outlined"
                        component={TextField}
                        autoComplete="off"
                        rowsMax="10"
                        onKeyPress={handleKeyPress}
                        multiline
                        fullWidth
                    />
                    <input type="submit" value="Submit" />
                </StyledForm>
            )}
        </Formik>
    );
};
